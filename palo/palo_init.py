import json
import time
from time import sleep

import paramiko

PALO_IP = "10.20.199.108"
INTERNAL_BASE = "10.10.10."
INITIAL_PASS = input("Initial:")
PASSWORD = input("Pass:")
LOOKUP = {"21": "ftp", "22": "ssh", "25": "smtp", "53": "dns", "80": "web-broswing", "443": "ssl"}


def sl(svc) -> str:
    if isinstance(svc, int):
        return LOOKUP[str(svc)]
    return svc


log = open("palo.log", "wb")


def out(prompt: str) -> str:
    ret = b""
    while prompt.encode("UTF8") not in ret or shell.recv_ready():
        new = shell.recv(4096)
        ret += new
        log.write(new)
        log.flush()
        time.sleep(0.01)
    return ret.decode()


def c(com: str, valid: str = "", prompt: str = "admin@"):
    print(f">{com}")
    shell.exec_command(com.encode("UTF8") + b"\n")
    resp = out(prompt)
    if valid not in resp:
        print("Error with command:" + com)
        print(resp)
        print()
    # sleep(1)
    while shell.recv_ready():
        print("Clearing garbage: {}".format(shell.recv(4096)))


ERRORS = ["Unknown command", "Invalid syntax."]

client = paramiko.SSHClient()
client.connect(PALO_IP, username="admin", password=INITIAL_PASS, timeout=5)
del INITIAL_PASS
shell = client.invoke_shell()
print("Logged in!")

out("admin@")

c("set cli scripting-mode on")
c("request system software check")
c("request system software download version 9.0.0", "Download job enqueued with jobid")
c("request anti-virus upgrade download latest", "Download job enqueued with jobid")
c("request wildfire upgrade download latest", "Download job enqueued with jobid")
c("configure", "Entering configuration mode")
c("set mgt-config users {} permissions role-based superuser yes".format(A2), "[edit]")
c("set mgt-config users {0} password".format(A2), prompt="Enter password")
sleep(0.1)
c(PASSWORD, prompt="Confirm password")
sleep(0.1)
c(PASSWORD)
c("set mgt-config users admin password", prompt="Enter password")
sleep(0.1)
c(PASSWORD, prompt="Confirm password")
sleep(0.1)
c(PASSWORD)
c("set deviceconfig system device-telemetry device-health-performance no product-usage no threat-prevention no")
for i in range(1, 10):
    c("set network interface ethernet ethernet1/{} layer2 lldp enable no".format(i))
c("set zone WAN network layer2 ethernet1/1")
c("set zone DMZ network layer2 [ ethernet1/2 ethernet1/3 ethernet1/4 ethernet1/5 ethernet1/6 ethernet1/7 ethernet1/8 ]")
c("set zone LAN network layer2 ethernet1/9")
c("set network vlan Net interface [ ethernet1/1 ethernet1/2 ethernet1/3 ethernet1/4 ethernet1/5 ethernet1/6 ethernet1/7 ethernet1/8 ethernet1/9 ]")

for t in ["ftp", "http", "http2", "imap", "pop3", "smb", "smtp"]:
    c("set profiles virus Max decoder {} action reset-both mlav-action reset-both wildfire-action reset-both".format(t))

for t in ["Executable Linked Format", "PowerShell Script 1", "PowerShell Script 2", "Windows Executables", "MSOffice"]:
    c("set profiles virus Max mlav-engine-filebased-enabled \"{}\" mlav-policy-action enable".format(t))

c("set profiles data-objects pii pattern-type predefined pattern credit-card-numbers file-type any")
c("set profiles data-objects pii pattern-type predefined pattern social-security-numbers file-type any")
c("set profiles data-objects pii pattern-type predefined pattern social-security-numbers-without-dash file-type any")
c("set profiles data-filtering PII data-capture yes rules R1 alert-threshold 0 block-threshold 0 data-object pii direction both log-severity high application any file-type any")

c("set profile-group Main virus Max spyware strict vulnerability strict data-filtering PII url-filtering default file-blocking \"strict file blocking\" wildfire-analysis default")

c("commit", "committed")

cfg = json.load(open("config.json"))["DMZ"]
dc = []

for box in cfg:
    sysname = "{} - {}".format(box, cfg[box]["ip"])
    c("set address \"{}\" ip-netmask {}{}".format(sysname, INTERNAL_BASE, cfg[box]["ip"]))
    if "dc" in cfg[box]:
        dc.append(sysname)
    if "svc" not in cfg[box]:
        continue
    app = " ".join([sl(a) for a in cfg[box]["svc"]] if isinstance(cfg[box]["svc"], list) else [sl(cfg[box]["svc"])])
    c("set rulebase security rules \"{}\" from any source any to DMZ destination \"{}\" application [ {} ] service application-default action allow profile-setting group Main".format(
        box, sysname, app))

sys = " ".join(['"' + a + '"' for a in dc])
c("set rulebase security rules \"Windows Domain\" from LAN source any to DMZ destination [ {} ] application [ active-directory dns kerberos ldap ms-ds-smb ms-netlogon msrpc ] service application-default action allow profile-setting group Main".format(
    sys))
c("set rulebase security rules Outbound from any source any to WAN destination any application [ web-browsing ssl ] service [ service-http service-https ] action allow profile-setting group Main")
c("set rulebase security rules Ping from any source any to any destination any application ping service application-default action allow profile-setting group Main")
c("set rulebase default-security-rules rules intrazone-default action allow log-end yes profile-setting group Main")
c("set rulebase default-security-rules rules interzone-default action drop log-end yes")
c("commit", "committed")

c("exit")

c("request anti-virus upgrade install version latest", "Content install job enqueued with jobid")
sleep(10)
c("request wildfire upgrade install version latest", "Content install job enqueued with jobid")
sleep(10)
c("request system software install version 9.0.0", "Software install job enqueued with jobid")
c("y")
sleep(10)
print("Done?")
