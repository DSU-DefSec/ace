local scout = require("scout")

local addr, port = string.match(scout.address, "([.%d]+):(%d+)")
local hostname = string.match(scout.sh.hostname(), "^(.*)\n$")
if hostname == "localhost" or hostname == "" then
    hostname = addr
end

local function printf(...)
    return print(string.format(...))
end

local function errorf(...)
    error(string.format(...), 2)
end

local log_colors = {
    [0] = 36,
    [1] = 34,
    [2] = 32,
    [3] = 33,
    [4] = 31,
    [5] = 41,
}
local log_level = tonumber(env.log_level) or 0
local function log(level, ...)
    if level <= log_level then
        print(string.format("\027[%dm%s\027[0m:\t", log_colors[level], addr) .. string.format(...))
    end
end

log(2, "Logged in as %q with password %q", scout.username, scout.password)

-- Verify privilege escalation capabilities
local success, output = pcall(scout.sh.sudo.id)
if success and string.match(output, "uid%=0") then
    log(4, "Able to escalate privileges successfully: %s", output)
else
    errorf("Unable to escalate privileges successfully: %s", output)
end

local local_ip, local_port, remote_ip, remote_port = string.match(scout.env["SSH_CONNECTION"], "(%S+) (%d+) (%S+) (%d+)")

local management_network = env.management_network or local_ip
local whitelist = {}
if env.whitelist then
    for m in string.gmatch(env.whitelist, "[^,]+") do
        table.insert(whitelist, m)
    end
end

--- Saves data to local disk
---@param path string Path to the local file
---@param data string Data to save
local function write_file(path, data)
    local f = io.open(path, "w")
    if f ~= nil then
        f:write(data)
        f:close()
    end
end

local function backup_data(name, data)
    return write_file(string.format("%s-%s.txt", addr, name), data)
end

local function configure_sshd()
    -- Load the config and back it up
    local config = scout.sudo_load_file("/etc/ssh/sshd_config")
    backup_data("sshd_config", config)
    local management_config_snippet = string.format("\nMatch Address %s\n\tAcceptEnv *\n\tPermitRootLogin yes\n\tPasswordAuthentication yes\n", management_network)
    scout.sudo_save_file("/etc/ssh/sshd_config", config .. management_config_snippet)
    log(2, "Patched /etc/sshd_config")

    -- Oh boy, I sure do love standard service control interfaces!
    -- Evil and intimidating lack of standards:
    scout.sh.sudo.sh("-c", "service sshd restart || systemctl restart sshd || service ssh restart || systemctl restart ssh || rc-service sshd restart")
    log(2, "Restarted SSHD")
end

-- Gets the IP address of every network interface
local function get_networks()
    local address_info_raw = scout.sh.ip.address()
    local address_info = {}
    local cur_interface = ""
    for line in string.gmatch(address_info_raw, "[^\n]+") do
        local name = string.match(line, "%d+: (%S-):")
        if name ~= nil then
            cur_interface = name
        end
        
        local cur_addr = string.match(line, "%s+inet (%d+%.%d+%.%d+%.%d+/%d+)")
        if cur_addr ~= nil then
            address_info[cur_interface] = cur_addr
        end
    end
    return address_info
end

local function get_local_network()
    for interface, network in pairs(get_networks()) do
        if string.find(interface, "e") then
            return network
        end
    end
end

--- Locks the firewall
local function lock_firewall()
    local local_network = get_local_network()

    -- Back up the old rules
    local firewall = scout.sh.sudo.iptables("-S")
    backup_data("iptables", firewall)

    -- Reset policies
    scout.sh.sudo.iptables("-P", "INPUT",  "ACCEPT")
    scout.sh.sudo.iptables("-P", "OUTPUT", "ACCEPT")
    log(2, "Reset policies")

    -- Flush old rules
    scout.sh.sudo.iptables("-F")
    log(2, "Flushed old rules")

    -- Allow loopback
    scout.sh.sudo.iptables("-A", "INPUT",  "-s", "127.0.0.1/8", "-j", "ACCEPT")
    scout.sh.sudo.iptables("-A", "OUTPUT", "-d", "127.0.0.1/8", "-j", "ACCEPT")
    log(2, "Allowed loopback")

    -- Connection tracking
    scout.sh.sudo.iptables("-A", "INPUT",  "-m", "conntrack", "--ctstate", "RELATED,ESTABLISHED", "-j", "ACCEPT")
    scout.sh.sudo.iptables("-A", "OUTPUT", "-m", "conntrack", "--ctstate", "RELATED,ESTABLISHED", "-j", "ACCEPT")
    log(2, "Enabled connection tracking")

    -- Whitelist connection back
    scout.sh.sudo.iptables("-A", "INPUT", "-s", local_ip, "-j", "ACCEPT")
    scout.sh.sudo.iptables("-A", "OUTPUT", "-d", local_ip, "-j", "ACCEPT")
    log(2, "Whitelisted connection back")

    -- Whitelist common ports that are in use (Explicitly ignore ssh)
    for _, port in ipairs({23,139,445,9000,9090}) do
        local status, stdout, _ = scout.run_sudo(string.format("ss -t4ln dport = %d | wc -l", port))
        if status ~= 0 or tonumber(stdout) > 1 then
            scout.sh.sudo.iptables("-A", "INPUT", "-p", "tcp", "--dport", port, "-j", "ACCEPT")
            log(3, "Whitelisted %d/tcp", port)
        end
    end
    log(2, "Whitelisted services")

    -- Whitelist database ports
    for _, port in ipairs({1433,3306,5432}) do
        local status, stdout, _ = scout.run_sudo(string.format("ss -t4ln dport = %d | wc -l", port))
        if status ~= 0 or tonumber(stdout) > 1 then
            scout.sh.sudo.iptables("-A", "INPUT", "-s", local_network, "-p", "tcp", "--dport", port, "-j", "ACCEPT")
            log(3, "Whitelisted %d/tcp on the local network (%s)", port, local_network)
        end
    end
    log(2, "Whitelisted local databases")

    -- Add whitelist
    for _, subnet in ipairs(whitelist) do
        scout.sh.sudo.iptables("-A", "INPUT",  "-s", subnet, "-j", "ACCEPT")
        scout.sh.sudo.iptables("-A", "OUTPUT", "-d", subnet, "-j", "ACCEPT")
    end
    log(2, "Added whitelist")

    -- Change the policies (plus anti-lockout)
    for _, val in ipairs({"INPUT", "OUTPUT"}) do
        log(3, "Changing %s policy to DROP...", val)
        log(4, "Starting anti-lockout process...")
        local proc = scout.ssh_sudo("iptables -P "..val.." DROP && sleep 2 && iptables -P "..val.." ACCEPT")
        scout.sleep(1)
        log(4, "Killing anti-lockout process...")
        proc:close()
        local status = proc:wait()
        if status ~= 129 then -- 129 is the exit code when the process is killed
            errorf("Anti-lockout failed to configure (status code %d)", status)
        else
            log(3, "Changed %s policy to DROP", val)
        end
    end
    log(2, "Changed policies to DROP")
end

-- Make sure not to run on esxi
local status, stdout, _ = scout.run("esxcli system version get")
if status == 0 then
    return string.match(stdout, "(.-)\n?$"), false
end

-- Make sure not to run on windows
local status, stdout, _ = scout.run("winver")
if status == 0 then
    return string.match(stdout, "(.-)\n?$"), false
end

-- Make sure not to run on proxmox
local status, stdout, _ = scout.run("pveversion")
if status == 0 then
    return string.match(stdout, "(.-)\n?$"), false
end

-- Make sure not to run on pfSense
local status = scout.run("pfSsh.php -v")
if status == 0 then
    return "Running pfSense", false
end

configure_sshd()
log(1, "Reconfigured sshd")

backup_data("shadow", scout.sudo_load_file("/etc/shadow"))

local password = scout.passgen(addr .. "root")
scout.change_password("root", password)
log(1, "Changed root password")

lock_firewall()
log(1, "Locked firewall")

-- Burn down the bridge behind us
local privesc_conf_table = {
    sudo = "/etc/sudoers",
    doas = "/etc/doas.conf",
}
if privesc_conf_table[scout.sudo] then
    scout.sh.sudo.mv(privesc_conf_table[scout.sudo], "/root/privesc")
end
log(1, "Burned bridges (%s)", scout.sudo)

return "All done!"