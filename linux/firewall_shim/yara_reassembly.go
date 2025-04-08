package main

import (
	"bytes"
	"fmt"
	"time"

	yara_x "github.com/VirusTotal/yara-x/go"
	"github.com/corazawaf/coraza/v3"
	"github.com/corazawaf/coraza/v3/types"
	nfqueue "github.com/florianl/go-nfqueue/v2"
	"github.com/google/gopacket"
	"github.com/google/gopacket/tcpassembly"
)

type yaraStreamFactory struct {
	id_map map[time.Time]uint32
	nf     *nfqueue.Nfqueue
	rules  *yara_x.Rules
	waf    coraza.WAF

	max_length int
}

type yaraStream struct {
	factory        *yaraStreamFactory
	net, transport gopacket.Flow
	tx             types.Transaction

	buf *bytes.Buffer

	is_bad bool
}

func (h *yaraStreamFactory) New(net, transport gopacket.Flow) tcpassembly.Stream {
	ret := &yaraStream{
		factory:   h,
		net:       net,
		transport: transport,
		is_bad:    false,

		buf: bytes.NewBuffer(nil),
	}

	return ret
}

func (s *yaraStream) KillConnection(id uint32, reason string) {
	// I cannot for the life of me figure out how to close
	// the connection properly. Nothing I have tried works
	// so I'm just setting every interesting TCP flag I can
	// and firing it back at the offending peer

	// fmt.Printf("Killing connection %d\n", id)

	if !s.is_bad && len(reason) > 0 {
		fmt.Printf("Killing connection %s %s: %s\n", s.net.String(), s.transport.String(), reason)
	}

	// pkt := s.factory.pkt_map[id]
	// tcp := *pkt.Layer(layers.LayerTypeTCP).(*layers.TCP)
	// ip := *pkt.Layer(layers.LayerTypeIPv4).(*layers.IPv4)

	// tcp.SrcPort, tcp.DstPort = tcp.DstPort, tcp.SrcPort
	// tcp.Seq, tcp.Ack = tcp.Ack, tcp.Seq
	// tcp.Ack += uint32(len(tcp.Payload))

	// tcp.RST = true

	// tcp.SYN = false
	// tcp.ACK = true
	// tcp.FIN = true
	// tcp.URG = true
	// tcp.PSH = false
	// tcp.Payload = []byte{}
	// // tcp.Seq = 0

	// buf := gopacket.NewSerializeBuffer()
	// opts := gopacket.SerializeOptions{
	// 	FixLengths:       true,
	// 	ComputeChecksums: true,
	// }
	// gopacket.SerializeLayers(buf, opts,
	// 	&tcp,
	// )
	// data := buf.Bytes()

	// conn, err := net.Dial("ip4:tcp", ip.SrcIP.String())
	// if err != nil {
	// 	fmt.Printf("Dial: %s\n", err)
	// 	return
	// }

	// conn.Write(data)
	// conn.Close()

	s.is_bad = true
	s.factory.nf.SetVerdict(id, nfqueue.NfDrop)
	s.buf = nil
}

func (s *yaraStream) Reassembled(data_slice []tcpassembly.Reassembly) {
	for _, data := range data_slice {
		id, ok := s.factory.id_map[data.Seen]
		// fmt.Printf("Reassembled %d\n", id)
		if !ok {
			fmt.Printf("Can't get id for packet seen at %v\n", data.Seen)
			continue
		}

		if s.is_bad {
			s.KillConnection(id, "")
			continue
		}

		if len(data.Bytes) == 0 {
			s.factory.nf.SetVerdict(id, nfqueue.NfAccept)
			continue
		}

		if s.buf.Len()+len(data.Bytes) > s.factory.max_length {
			s.KillConnection(id, fmt.Sprintf("too long (%d bytes with maximum %d bytes)", s.buf.Len()+len(data.Bytes), s.factory.max_length))
			continue
		}

		s.buf.Write(data.Bytes)

		byt := s.buf.Bytes()
		results, err := s.factory.rules.Scan(byt)
		if err != nil {
			s.KillConnection(id, "error in scan: "+err.Error())
			continue
		}

		matches := results.MatchingRules()
		for _, result := range matches {
			fmt.Printf("Matched %s on connection from %s %s\n", result.Identifier(), s.net.String(), s.transport.String())
		}
		if len(matches) > 0 {
			s.KillConnection(id, "matched rule(s)")
			continue
		}

		requests := get_requests(byt)
		killed := false
		for i := 0; i < len(requests); i++ {
			tx := s.factory.waf.NewTransaction()
			req := requests[i]
			req.RemoteAddr = fmt.Sprintf("%s:%s", s.net.Src().String(), s.net.Src().String())
			it, err := processRequest(tx, req)
			if err != nil {
				s.KillConnection(id, "error processing request: "+err.Error())
				continue
			}
			tx.Close()
			if it != nil {
				s.KillConnection(id, fmt.Sprintf("malicious request: %v", it))
				killed = true
				break
			}
		}
		if killed {
			continue
		}

		s.factory.nf.SetVerdict(id, nfqueue.NfAccept)
	}
}

func (s *yaraStream) ReassemblyComplete() {
	// fmt.Printf("Finished reassembly: %s %s (Read %d bytes)\n", s.net, s.transport, s.total_read)
	s.buf = nil
}
