import json
import time
from time import sleep

import paramiko

PALO_IP = "10.20.199.109"
INTERNAL_BASE = "10.10.10."
INITIAL_PASS = input("Initial:")
PASSWORD = input("Pass:")
LOOKUP = {"21": "ftp", "22": "ssh", "25": "smtp", "53": "dns", "80": "web-broswing", "443": "ssl"}


def sl(svc) -> str:
    if isinstance(svc, int):
        return LOOKUP[str(svc)]
    return svc


def out() -> str:
    ret = b""
    while b"admin@" not in ret:
        ret += shell.recv(4096)
        time.sleep(0.01)
    return ret.decode()


def c(com: str, valid: str = ""):
    shell.exec_command(com.encode("UTF8") + b"\n")
    resp = out()
    if valid not in resp:
        print("Error with command:" + com)
        print(resp)


ERRORS = ["Unknown command", "Invalid syntax."]

client = paramiko.SSHClient()
client.connect(PALO_IP, username="admin", password=INITIAL_PASS, timeout=5)
del INITIAL_PASS
shell = client.invoke_shell()
print("Logged in!")

c("set cli scripting-mode on")
c("request system software download version 9.0.0", "Download job enqueued with jobid")
c("request anti-virus upgrade download latest", "Download job enqueued with jobid")
c("request wildfire upgrade download latest", "Download job enqueued with jobid")
c("configure", "Entering configuration mode")
c("set mgt-config users {} permissions role-based superuser yes".format(A2), "[edit]")
c("set mgt-config users {} password".format(A2))
c(PASSWORD + "\n" + PASSWORD)
c("set mgt-config users admin password")
c(PASSWORD + "\n" + PASSWORD)

c("set deviceconfig system device-telemetry device-health-performance no product-usage no threat-prevention no")
c("set zone LAN")
c("set zone WAN")
c("set zone DMZ")

for t in ["ftp", "http", "http2", "imap", "pop3", "smb", "smt"]:
    "set profiles virus Max decoder {} action reset-both mlav-action reset-both wildfire-action reset-both".format(t)

for t in ["Executable Linked Format", "PowerShell Script 1", "PowerShell Script 2", "Windows Executables", "MSOffice"]:
    "set profiles virus Max mlav-engine-filebased-enabled \"{}\" mlav-policy-action enable".format(t)

c("set profile-group Main virus Max spyware strict vulnerability strict file-blocking \"strict file blocking\" wildfire-analysis default")

c("commit", "committed")

cfg = json.load(open("urmom.json"))
dc = []

for box in cfg:
    sysname = "{} - {}".format(box, cfg[box]["ip"])
    c("set address \"{}\" ip-netmask {}{}".format(sysname, INTERNAL_BASE, cfg[box]["ip"]))
    if "dc" in cfg[box]:
        dc.append(sysname)
    if "svc" not in cfg[box]:
        continue
    app = [sl(a) for a in cfg[box]["svc"]] if isinstance(cfg[box]["svc"], list) else [sl(cfg[box]["svc"])]
    c("set rulebase security rules \"{}\" from any source any to DMZ destination \"{}\" application [ {} ] service application-default action allow profile-setting group Main".format(
        box, sysname, app))

sys = " ".join(['"' + a + '"' for a in dc])
c("set rulebase security rules \"Windows Domain\" from LAN source any to DMZ destination [ {} ] application [ active-directory dns kerberos ldap ms-ds-smb ms-netlogon msrpc ] service application-default action allow profile-setting proup Main".format(
    sys))
c("set rulebase security rules Outbound from any source any to WAN destination any application [ web-browsing ssl ] service [ service-http service-https ] action allow profile-setting proup Main")

c("commit", "committed")

c("request anti-virus upgrade install version latest", "Content install job enqueued with jobid")
sleep(20)
c("request wildfire upgrade install version latest", "Content install job enqueued with jobid")
sleep(20)
c("request system software install version 9.0.0", "Software install job enqueued with jobid")
c("y")
sleep(20)
print("Done?")
