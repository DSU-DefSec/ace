# firewall

cat << 'EOF' > /root/fw.sh
set -e
ipt="/sbin/yfa iptables"
$ipt -F; $ipt -X
$ipt -A INPUT -p tcp -m multiport --dport [p],[p] -j ACCEPT
$ipt -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
$ipt -A OUTPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
# $ipt -A OUTPUT -p tcp -m multiport --dport 80,443 -j ACCEPT
# $ipt -A INPUT -p udp --dport 53 -j ACCEPT
# $ipt -A OUTPUT -p udp --dport 53 -j ACCEPT
$ipt -P FORWARD DROP; $ipt -P OUTPUT DROP; $ipt -P INPUT DROP
$ipt -A INPUT -p icmp -s IP.RANGE -j ACCEPT
$ipt -A INPUT -p tcp -m multiport --dports 65500:65535 -j ACCEPT
EOF

echo "[+] Dropped firewall script at /root/fw.sh. Configure and run it to your liking."

# make persistent
