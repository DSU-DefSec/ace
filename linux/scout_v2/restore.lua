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

local log_level = tonumber(env.log_level) or 0
local function log(level, ...)
    if level <= log_level then
        io.write(addr .. ":\t")
        printf(...)
    end
end

log(2, "Logged in as %q with password %q", scout.username, scout.password)

local local_ip, local_port, remote_ip, remote_port = string.match(scout.env["SSH_CONNECTION"], "(%S+) (%d+) (%S+) (%d+)")

local management_network = env.management_network or local_ip
local whitelist = {}
if env.whitelist then
    for m in string.gmatch(env.whitelist, "[^,]+") do
        table.insert(whitelist, m)
    end
end

local function read_file(path)
    local f, err = io.open(path, "r")
    if f ~= nil then
        local data = f:read("*a")
        f:close()
        return data
    end
    errorf("Unable to read %s: %s", path, err)
end

local function load_backup(name)
    return read_file(string.format("%s-%s.txt", addr, name))
end

local function restore_backup(name, path, owner, group, permissions)
    local data = load_backup(name)
    scout.sudo_save_file(path, data)
    if owner then
        scout.sh.sudo.chown(owner, path)
    end
    if group then
        scout.sh.sudo.chgrp(group, path)
    end
    if permissions then
        scout.sh.sudo.chmod(permissions, path)
    end
end

restore_backup("sshd_config", "/etc/ssh/sshd_config", "root", "root", "u=rw,g=r,o=r")
restore_backup("shadow", "/etc/shadow", "root", "shadow", "u=rw,g=r,o=")
local firewall = load_backup("iptables")
-- Reset policies
scout.sh.sudo.iptables("-P", "INPUT",  "ACCEPT")
scout.sh.sudo.iptables("-P", "OUTPUT", "ACCEPT")
log(2, "Reset policies")

-- Flush old rules
scout.sh.sudo.iptables("-F")
log(2, "Flushed old rules")
for line in string.gmatch(firewall, "[^\n]") do
    scout.run_sudo("iptables " .. line)
end

