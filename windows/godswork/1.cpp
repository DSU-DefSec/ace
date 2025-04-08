#include <windows.h>
#include <tlhelp32.h>
#include <psapi.h>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <set>
#include <algorithm>
#include <ctime>
#include <sstream>
#include <thread>
#include <mutex>
#include <map>
#pragma comment(lib, "Psapi.lib")

static std::string processNames[] = {
    "rpc.exe",
    "netlogon.exe",
    "msedge.exe",
    "chrome.exe",
    "git.exe",
    "firefox.exe",
    "winrm.exe",
    "dns.exe",
    "lsass.exe",
    "store.exe",
    "sshd.exe",
    "ftpsvc.exe",
    "smb.exe",
    "nginx.exe",
    "w3wp.exe",
    "httpd.exe",
    "krb5kdc.exe",
    "sqlservr.exe",
    "ccsclient.exe"
};

static std::string applicationPorts[] = {
    "135",
    "all",
    "all",
    "all",
    "all",
    "all",
    "5985,5986",
    "53",
    "389",
    "25,443,587",
    "22",
    "21",
    "445",
    "80,443",
    "80,443",
    "80,443",
    "88",
    "1433",
    "all"
};

class Logger {
private:
    std::ofstream logFile;
    std::string getTimestamp() {
        std::time_t now = std::time(nullptr);
        std::tm localTime;
        localtime_s(&localTime, &now);
        char buffer[20];
        std::strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &localTime);
        return std::string(buffer);
    }
public:
    Logger(const std::string& filename) {
        logFile.open(filename, std::ios::app);
        if (logFile.is_open()) {
            log("[INFO] Logging started.");
        }
    }
    ~Logger() {
        if (logFile.is_open()) {
            log("[INFO] Logging ended.");
            logFile.close();
        }
    }
    void log(const std::string& message) {
        if (logFile.is_open()) {
            logFile << "[" << getTimestamp() << "] " << message << std::endl;
        }
    }
};

bool executeNetshCommandThreadSafe(const std::string& command, Logger& logger, std::mutex& logMutex) {
    {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[INFO] Executing command: " + command);
    }
    int result = system(command.c_str());
    {
        std::lock_guard<std::mutex> lock(logMutex);
        if (result != 0) {
            logger.log("[ERROR] Command failed with code: " + std::to_string(result));
            return false;
        }
        else {
            logger.log("[INFO] Command executed successfully.");
        }
    }
    return true;
}

struct ProcessInfo {
    std::string name;
    DWORD pid;
    std::string executablePath;
};

std::string getExecutablePath(DWORD processID, Logger& logger, std::mutex& logMutex) {
    std::string exePath;
    HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, processID);
    if (hProcess != NULL) {
        char buffer[MAX_PATH];
        if (GetModuleFileNameExA(hProcess, NULL, buffer, MAX_PATH)) {
            exePath = std::string(buffer);
        }
        else {
            std::lock_guard<std::mutex> lock(logMutex);
            logger.log("[ERROR] Failed to get executable path for PID: " + std::to_string(processID));
        }
        CloseHandle(hProcess);
    }
    else {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[ERROR] Failed to open process for PID: " + std::to_string(processID));
    }
    return exePath;
}

std::vector<ProcessInfo> getRunningProcesses(Logger& logger, std::mutex& logMutex) {
    std::vector<ProcessInfo> runningProcesses;
    HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (snapshot == INVALID_HANDLE_VALUE) {
        logger.log("[ERROR] Failed to create process snapshot.");
        return runningProcesses;
    }
    PROCESSENTRY32 pe;
    pe.dwSize = sizeof(PROCESSENTRY32);
    if (Process32First(snapshot, &pe)) {
        do {
            ProcessInfo pInfo;
            std::wstring wname(pe.szExeFile);
            pInfo.name = std::string(wname.begin(), wname.end());
            pInfo.pid = pe.th32ProcessID;
            std::transform(pInfo.name.begin(), pInfo.name.end(), pInfo.name.begin(), ::tolower);
            pInfo.executablePath = getExecutablePath(pe.th32ProcessID, logger, logMutex);
            runningProcesses.push_back(pInfo);
        } while (Process32Next(snapshot, &pe));
    }
    else {
        logger.log("[ERROR] Process32First failed.");
    }
    CloseHandle(snapshot);
    {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[INFO] Process enumeration completed. Total processes found: " +
            std::to_string(runningProcesses.size()));
    }
    return runningProcesses;
}

std::vector<std::string> splitString(const std::string& input, char delimiter) {
    std::vector<std::string> tokens;
    size_t start = 0;
    size_t end = 0;
    while ((end = input.find(delimiter, start)) != std::string::npos) {
        std::string token = input.substr(start, end - start);
        if (!token.empty()) {
            tokens.push_back(token);
        }
        start = end + 1;
    }
    std::string token = input.substr(start);
    if (!token.empty()) {
        tokens.push_back(token);
    }
    return tokens;
}

int main(int argc, char* argv[]) {
    Logger logger("firewallfucker.log");
    std::mutex logMutex;
    {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[INFO] Program started.");
    }
    executeNetshCommandThreadSafe("netsh advfirewall firewall delete rule name=all", logger, logMutex);
    executeNetshCommandThreadSafe("netsh advfirewall firewall add rule name=\"Allow_PSEXEC_SMB_IN\" dir=in action=allow protocol=TCP localport=445 remoteip=any", logger, logMutex);
    std::string subnet = "any";
    if (argc > 1) {
        subnet = argv[1];
        {
            std::lock_guard<std::mutex> lock(logMutex);
            logger.log("[INFO] Subnet specified: " + subnet);
        }
    }
    else {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[INFO] No subnet argument provided; using 'any'.");
    }
    std::vector<ProcessInfo> runningProcesses = getRunningProcesses(logger, logMutex);
    std::set<std::string> portsToAllow;
    bool allowAllCCSClient = false;
    std::string ccsClientPath;
    {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[INFO] Matching running processes against whitelist.");
    }
    for (size_t i = 0; i < sizeof(processNames) / sizeof(processNames[0]); ++i) {
        std::string whitelistProc = processNames[i];
        std::transform(whitelistProc.begin(), whitelistProc.end(), whitelistProc.begin(), ::tolower);
        for (const auto& proc : runningProcesses) {
            if (proc.name == whitelistProc) {
                {
                    std::lock_guard<std::mutex> lock(logMutex);
                    logger.log("[INFO] Whitelisted process running: " + proc.name +
                        " (PID: " + std::to_string(proc.pid) + ") " +
                        " Path: " + proc.executablePath);
                }
                std::vector<std::string> foundPorts = splitString(applicationPorts[i], ',');
                for (auto& p : foundPorts) {
                    p.erase(std::remove_if(p.begin(), p.end(), ::isspace), p.end());
                    if (p == "all") {
                        if (whitelistProc == "ccsclient.exe") {
                            allowAllCCSClient = true;
                            ccsClientPath = proc.executablePath;
                            {
                                std::lock_guard<std::mutex> lock(logMutex);
                                logger.log("[INFO] CCSClient.exe detected. All inbound ports allowed. "
                                    "Executable Path: " + ccsClientPath);
                            }
                        }
                    }
                    else {
                        portsToAllow.insert(p);
                        {
                            std::lock_guard<std::mutex> lock(logMutex);
                            logger.log("[INFO] Port added to allow list: " + p);
                        }
                    }
                }
            }
        }
    }
    std::map<std::string, std::string> processPathMap;
    for (const auto& proc : runningProcesses) {
        processPathMap[proc.name] = proc.executablePath;
    }
    for (const auto& port : portsToAllow) {
        {
            std::ostringstream oss;
            oss << "netsh advfirewall firewall add rule name=\"Allow_In_TCP_" << port
                << "\" dir=in action=allow protocol=TCP localport=" << port
                << " remoteip=" << subnet;
            executeNetshCommandThreadSafe(oss.str(), logger, logMutex);
        }
        {
            std::ostringstream oss;
            oss << "netsh advfirewall firewall add rule name=\"Allow_In_UDP_" << port
                << "\" dir=in action=allow protocol=UDP localport=" << port
                << " remoteip=" << subnet;
            executeNetshCommandThreadSafe(oss.str(), logger, logMutex);
        }
        {
            std::ostringstream oss;
            oss << "netsh advfirewall firewall add rule name=\"Allow_Out_TCP_" << port
                << "\" dir=out action=allow protocol=TCP localport=" << port;
            executeNetshCommandThreadSafe(oss.str(), logger, logMutex);
        }
        {
            std::ostringstream oss;
            oss << "netsh advfirewall firewall add rule name=\"Allow_Out_UDP_" << port
                << "\" dir=out action=allow protocol=UDP localport=" << port;
            executeNetshCommandThreadSafe(oss.str(), logger, logMutex);
        }
    }
    if (allowAllCCSClient && !ccsClientPath.empty()) {
        std::string escapedPath;
        escapedPath.reserve(ccsClientPath.size() * 2);
        for (char c : ccsClientPath) {
            if (c == '\\') {
                escapedPath += "\\\\";
            }
            else {
                escapedPath += c;
            }
        }
        {
            std::ostringstream oss;
            oss << "netsh advfirewall firewall add rule name=\"Allow_CCSClient_Inbound\""
                << " dir=in action=allow program=\"" << escapedPath << "\""
                << " remoteip=" << subnet << " enable=yes";
            executeNetshCommandThreadSafe(oss.str(), logger, logMutex);
        }
        {
            std::ostringstream oss;
            oss << "netsh advfirewall firewall add rule name=\"Allow_CCSClient_Outbound\""
                << " dir=out action=allow program=\"" << escapedPath << "\" enable=yes";
            executeNetshCommandThreadSafe(oss.str(), logger, logMutex);
        }
    }
    else if (allowAllCCSClient && ccsClientPath.empty()) {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[ERROR] CCSClient.exe was detected but no valid executable path was found.");
    }
    {
        std::string wmiEnableCmd =
            "netsh advfirewall firewall set rule group=\"windows management instrumentation (wmi)\" new enable=yes";
        executeNetshCommandThreadSafe(wmiEnableCmd, logger, logMutex);
    }
    {
        std::string blockInboundCmd =
            "netsh advfirewall set allprofile firewallpolicy blockinbound,allowoutbound";
        executeNetshCommandThreadSafe(blockInboundCmd, logger, logMutex);
    }
    {
        std::lock_guard<std::mutex> lock(logMutex);
        logger.log("[INFO] Firewall rules configuration completed. Inbound is now default-block.");
    }
    return 0;
}
