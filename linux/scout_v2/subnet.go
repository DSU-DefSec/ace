package main

import (
	"encoding/binary"
	"fmt"
	"net"
	"regexp"
	"strconv"
)

// The following two functions are sourced from https://gist.github.com/ammario/649d4c0da650162efd404af23e25b86b
func ip2int(ip net.IP) uint32 {
	if len(ip) == 16 {
		return binary.BigEndian.Uint32(ip[12:16])
	}
	return binary.BigEndian.Uint32(ip)
}

func int2ip(nn uint32) net.IP {
	ip := make(net.IP, 4)
	binary.BigEndian.PutUint32(ip, nn)
	return ip
}

func ParseSubnet(subnet string) (addr string, port, bits int, err error) {
	re := regexp.MustCompile(`([0-9]{0,3}(?:\.[0-9]{0,3}){3})(?::([0-9]{1,5}))?(?:\/([0-9]{1,2}))?`)
	m := re.FindStringSubmatch(subnet)

	if len(m) == 0 {
		err = fmt.Errorf("unable to parse subnet: '%s'", subnet)
		return
	}

	port, err = strconv.Atoi(m[2])
	if err != nil {
		err = nil
		port = 22
	}

	bits, err = strconv.Atoi(m[3])
	if err != nil {
		err = nil
		bits = 32
	}

	addr_int := uint64(ip2int(net.ParseIP(m[1])))
	addr = int2ip(uint32(addr_int & ((0xFFFFFFFF << 24) - 1))).String()

	return
}

func GenerateSubnetAddresses(addr string, bits int) []string {
	network := ip2int(net.ParseIP(addr))
	var host_mask uint32 = (1 << (32 - bits)) - 1
	var network_mask uint32 = ^host_mask
	ret := []string{}
	for i := uint32(1); i < host_mask; i++ {
		ret = append(ret, int2ip((network&network_mask)|(i&host_mask)).String())
	}
	return ret
}

func FormatAddr(addr string, port int) string {
	return fmt.Sprintf("%s:%d", addr, port)
}

func ProcessAddr(subnet string) []string {
	addr, port, bits, err := ParseSubnet(subnet)
	if err != nil {
		return nil
	}

	if bits == 32 {
		return []string{FormatAddr(addr, port)}
	}

	ret := []string{}
	for _, a := range GenerateSubnetAddresses(addr, bits) {
		ret = append(ret, FormatAddr(a, port))
	}
	return ret
}
