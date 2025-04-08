local scout = require("scout")

local function printf(...)
    return print(string.format(...))
end

local function errorf(...)
    error(string.format(...), 2)
end

printf("Connected to %s as %s", scout.address, scout.username)

-- print(scout.sh.cat("/proc/mounts"))
-- print(string.format("%q", scout.sh.sudo.iptables("-S")))

-- print(string.format("%d\n%q\n%q", scout.run_sudo("iptables -S")))

-- local proc = scout.ssh("sudo iptables -S")
-- scout.handle_password_prompt(proc)
-- print(proc:wait())
-- print(proc.stdout:read("*a"))

for k,v in pairs(env) do
    print(k,v)
end

-- scout.save_file("test", "Hello, World!\n")
-- print("Saved test file.")
-- scout.sudo_save_file("sudo_test", "Hello, World!\n")
-- print("Saved sudo_test file.")

-- do return "test done" end

-- scout.sh.sudo("echo", "test")

local dummy_file = "/tmp/dummy"
local test_file = "/bin/ls"

local data = scout.load_file(test_file)
printf("Loaded %s (%d bytes)", test_file, string.len(data))

pcall(scout.sh.sudo.rm, dummy_file)

printf("Saving to %s", dummy_file)
scout.sudo_save_file(dummy_file, data)
printf("Saved bytes to %s", dummy_file)

-- print(scout.sh.stat(dummy_file))

-- print(scout.sh.sudo.id())

local sums = scout.hash(test_file, dummy_file)
for k,v in pairs(sums) do
    print(k,v)
end
if sums[dummy_file] ~= sums[test_file] then
    errorf("Test failed: %s is not the same as %s", test_file, dummy_file)
else
    printf("%s and %s are the same", test_file, dummy_file)
end

local proc2 = io.popen("sha256sum", "w")
if proc2 ~= nil then
    proc2:write(data)
end

local addr, port = string.match(scout.address, "([.%d]+):(%d+)")
-- local password = scout.passgen(addr .. "root")
print(addr, port)

local hostname = string.match(scout.sh.hostname(), "^(.*)\n$")
print(hostname)

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

for interface, network in pairs(get_networks()) do
    if string.find(interface, "e") then
        print(interface, network)
    end
end

return "Test successful"