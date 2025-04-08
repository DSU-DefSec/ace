local ret = {}

---@class Process
---@field stdin  file* File-like object representing stdin
---@field stdout file* File-like object representing stdout
---@field stderr file* File-like object representing stderr
---@field wait function Waits for process completion
---@field close function Forcibly kills the process
---@field signal function Sends a signal to the process (Names can be found on page 15 of RFC 4254)

--- Runs a command over SSH and returns a process
---@param cmd string Command to run
---@return Process proc Table containing process information
function ret.ssh(cmd)
    -- This is just for documentation
    return {}
end

--- Runs a command over SSH as root and returns a process
---@param cmd string Command to run
---@return Process proc Table containing process information
function ret.ssh_sudo(cmd)
    if ret.username == "root" then
        return ret.ssh(cmd)
    end

    local sudo = ret.check_sudo()
    if sudo then
        cmd = ret.privilege_escalation_handlers[sudo](cmd)
    end
    local proc = ret.ssh(cmd)
    ret.handle_password_prompt(proc)
    return proc
end

--- Escapes a string for use as a shell argument
---@param str string String to escape
---@return string ret Escaped string
function ret.escape(str)
    return "'" .. string.gsub(tostring(str), "'", "'\\''") .. "'"
end

--- Runs a command over ssh
--- @param cmd string
--- @return number status The exit status of the command (0 on success)
--- @return string stdout Stdout from the command
--- @return string stderr Stderr from the command
function ret.run(cmd)
    local proc = ret.ssh(cmd)
    local status = proc:wait()
    return status, proc.stdout:read("*a"), proc.stderr:read("*a")
end

-- The order is important
-- Commands are checked in this order
local privilege_escalation_commands = {
    "sudo",
    "doas",
    "su",
}

ret.privilege_escalation_handlers = {
    sudo = function (cmd)
        return string.format("sudo -c %s", ret.escape(cmd))
    end,
    su = function (cmd)
        return string.format("su -c %s", ret.escape(cmd))
    end,
    doas = function (cmd)
        return string.format("doas sh -c %s", ret.escape(cmd))
    end,
}

--- Checks if the target requires sudo for root permissions
---@return string|nil sudo name of the privilege escalation command
function ret.check_sudo()
    if ret.sudo == nil then
        if ret.username == "root" then
            return nil
        end
        for _, cmd in ipairs(privilege_escalation_commands) do
            local status = ret.run("command -v " .. cmd)
            if status == 0 then
                ret.sudo = cmd
                break
            end
        end
    end

    return ret.sudo
end

--- Wait for a password prompt and enter a password on the given process
--- @param proc Process Process to enter the password for
function ret.handle_password_prompt(proc)
    if ret.username == "root" then
        return
    end
    local buf = ""
    while not string.match(buf, "assword") do
        -- print(buf)
        local data = proc.stdout:read(32)
        if data == nil then
            break
        else
            buf = buf .. data
        end
    end
    local sudo = ret.check_sudo()
    if sudo == "su" then
        proc.stdin:write((ret.root_password or ret.password) .. "\n")
    else
        proc.stdin:write(ret.password .. "\n")
    end
    -- There are starving kids using chromebooks who could eat that leftover newline
    _ = proc.stdout:read(1)
end

--- Run a command with sudo
---@param cmd string Command to run (does not include sudo)
---@return number status The exit status of the command (0 on success)
---@return string stdout Stdout from the command
---@return string stderr Stderr from the command
function ret.run_sudo(cmd)
    if ret.username == "root" then
        return ret.run(cmd)
    end
    local sudo = ret.check_sudo()
    if sudo then
        cmd = ret.privilege_escalation_handlers[sudo](cmd)
    end
    local proc = ret.ssh(cmd)
    ret.handle_password_prompt(proc)
    local status = proc:wait()
    return status, proc.stdout:read("*a"), proc.stderr:read("*a")
end

local sh_mt = {}

sh_mt.__call = function (t, ...)
    local using_sudo = t[1] == "sudo"
    if using_sudo then
        table.remove(t, 1)
    end
    local args = {}
    for _,v in ipairs(t) do
        table.insert(args, ret.escape(v))
    end
    for _,v in ipairs(arg) do
        table.insert(args, ret.escape(v))
    end
    local cmd = table.concat(args, " ")
    -- print(cmd, t[1])
    local status, stdout, stderr
    if using_sudo then
        -- print("Running with sudo")
        status, stdout, stderr = ret.run_sudo(cmd)
    else
        -- print("Running without sudo")
        status, stdout, stderr = ret.run(cmd)
    end
    if status ~= 0 then
        error(string.format("%q exited with status %d: %q", cmd, status, stderr), 2)
    end
    return stdout
end

sh_mt.__index = function (t, k)
    local r = {}
    for _,k2 in ipairs(t) do
        table.insert(r, k2)
    end
    table.insert(r, k)
    setmetatable(r, sh_mt)
    return r
end

sh_mt.__newindex = function () end

--- Allows running commands by calling them as functions
ret.sh = {}
setmetatable(ret.sh, sh_mt)

--- Returns the size of a remote file
---@param path string Path to the file
---@return number size size of the file in bytes
function ret.stat_file(path)
    local proc = ret.ssh(string.format("stat -c %%s %s", ret.escape(path)))
    local size = proc.stdout:read("*n")
    proc:close()
    return size
end

--- Gets a little silly
---@return string joke Absolutely hilarious
function ret.funky()
    return string.char(88,53,79,33,80,37,64,65,80,91,52,92,80,90,88,53,52,40,80,94,41,55,67,67,41,55,125,36,69,73,67,65,82,45,83,84,65,78,68,65,82,68,45,65,78,84,73,86,73,82,85,83,45,84,69,83,84,45,70,73,76,69,33,36,72,43,72,42)
end

--- Loads a remote file
---@param path string Path to the file
---@return string data data from the file
function ret.load_file(path)
    local status, stdout, stderr = ret.run(string.format("base64 %s", ret.escape(path)))
    if status ~= 0 then
        error(stderr, 1)
    end
    return ret.b64decode(stdout)
end

local function find_best_factor(num)
    local val = 1
    while num % val == 0 do
        val = val * 2
    end
    local val = val / 2
    return val, num / val
end

--- Saves a remote file
---@param path string Path to the file
---@param data string Data to save
function ret.save_file(path, data)
    local enc_data = ret.b64encode(data)
    local enc_data_len = string.len(enc_data)
    local proc = ret.ssh(string.format("head -c %d | base64 -d | dd of=%s", enc_data_len, ret.escape(path)))
    -- print(data2)
    proc.stdin:write(enc_data .. "\n")
    proc.stdin:close()
    local status = proc:wait()
    if status ~= 0 then
        error(string.format("Failed to save %s: Process exited with code %d: %s", path, status, proc.stderr:read("*a")), 1)
    end
end

--- Loads a remote file as root using sudo
---@param path string Path to the file
---@return string data data from the file
function ret.sudo_load_file(path)
    if ret.username == "root" then
        return ret.load_file(path)
    end
    local status, stdout, stderr = ret.run_sudo(string.format("base64 %s", ret.escape(path)))
    if status ~= 0 then
        error(string.format("Failed to load file %q (code %d): %q", path, status, stderr), 1)
    end
    return ret.b64decode(stdout)
end

--- Saves a remote file as root using sudo
---@param path string Path to the file
---@param data string Data to save
function ret.sudo_save_file(path, data)
    if ret.username == "root" then
        return ret.save_file(path, data)
    end
    local enc_data = ret.b64encode(data)
    local enc_data_len = string.len(enc_data)
    local sudo = ret.check_sudo()
    local cmd = string.format("head -c %d | base64 -d > %s", enc_data_len, ret.escape(path))
    if sudo then
        cmd = ret.privilege_escalation_handlers[sudo](cmd)
    end
    print(cmd)
    local proc = ret.ssh(cmd)
    ret.handle_password_prompt(proc)
    local n = proc.stdin:write(enc_data)
    proc.stdin:close()
    local status = proc:wait()
    if status ~= 0 then
        error(string.format("Failed to save %s: Process exited with code %d: %s", path, status, proc.stderr:read("*a")), 1)
    end
    return n
end

--- Changes the password of a user
---@param user string User to change the password for
---@param password string Password to set
function ret.change_password(user, password)
    local hash = ret.crypt(password)
    -- print(user, password, hash)
    ret.sh.sudo.cp("/etc/shadow", "/etc/shadow-")
    local shadow = ret.sudo_load_file("/etc/shadow")
    local new_shadow = {}
    for line in string.gmatch(shadow, "[^\n]+") do
        local new_line = string.gsub(line, "^" .. user .. ":.-:", user .. ":" .. hash .. ":")
        -- print(new_line)
        table.insert(new_shadow, new_line)
    end
    ret.sudo_save_file("/etc/shadow", table.concat(new_shadow, "\n"))
    if user == ret.username then
        ret.password = password
    end
    if user == "root" then
        ret.root_password = password
    end
end

--- Hashes files on the remote machine
---@param ... string Files to hash
---@return table sums Table mapping paths to hashes
function ret.hash(...)
    local out = ret.sh.sha256sum(...)
    -- print(string.format("%q", out))
    local sums = {}
    for sum, path in string.gmatch(out, "([0-9a-fA-F]+)%s+(%S+)") do
        sums[path] = sum
    end
    return sums
end

--- Hashes files on remote machine using sudo
---@param ... string Files to hash
---@return table sums Table mapping paths to hashes
function ret.sudo_hash(...)
    local out = ret.sh.sudo.sha256sum(...)
    local sums = {}
    for sum, path in string.gmatch(out, "([0-9a-fA-F]+)%s+(%S+)") do
        sums[path] = sum
    end
    return sums
end

ret.env = {}
local env_mt = {}
function env_mt.__index(t, k)
    local status, stdout, stderr = ret.run(string.format("echo \"$%s\"", k))
    if status ~= 0 then
        error(stderr)
    end
    return stdout
end

function env_mt.__newindex() end

setmetatable(ret.env, env_mt)

return ret