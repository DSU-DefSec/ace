package main

import (
	"context"
	"fmt"
	"time"

	"github.com/florianl/go-nfqueue/v2"
	"github.com/google/gopacket"
	"github.com/mdlayher/netlink"
)

type NfQueuePacketSource struct {
	nf      *nfqueue.Nfqueue
	packets chan *PacketData
}

type PacketData struct {
	Timestamp time.Time
	PacketID  uint32
	Payload   []byte
}

func NewNfQueuePacketSource(ctx context.Context, queue_num uint16) (*NfQueuePacketSource, error) {
	// Set configuration options for nfqueue
	config := &nfqueue.Config{
		NfQueue:      queue_num,
		MaxPacketLen: 0xFFFF,
		MaxQueueLen:  0xFFFF,
		Copymode:     nfqueue.NfQnlCopyPacket,
		WriteTimeout: 100 * time.Millisecond,
	}

	s := &NfQueuePacketSource{
		packets: make(chan *PacketData, 1024),
	}
	var err error
	s.nf, err = nfqueue.Open(config)
	if err != nil {
		return nil, err
	}

	fn := func(a nfqueue.Attribute) int {
		id := *a.PacketID
		// // Just print out the id and payload of the nfqueue packet
		// fmt.Printf("[%d]\t%v\n", id, *a.Payload)
		// s.nf.SetVerdict(id, nfqueue.NfAccept)
		if len(s.packets) == cap(s.packets) {
			fmt.Printf("Packet channel full. Dropping %d\n", id)
			s.nf.SetVerdict(id, nfqueue.NfDrop)
		} else {
			pkt := &PacketData{
				PacketID: id,
				Payload:  *a.Payload,
			}
			if a.Timestamp != nil {
				pkt.Timestamp = *a.Timestamp
			}
			s.packets <- pkt
		}
		return 0
	}

	err = s.nf.RegisterWithErrorFunc(ctx, fn, func(e error) int {
		fmt.Println("NF_QUEUE Error:", e)
		return -1
	})
	if err != nil {
		s.nf.Close()
		return nil, err
	}

	// Avoid receiving ENOBUFS errors.
	if err := s.nf.SetOption(netlink.NoENOBUFS, true); err != nil {
		s.nf.Close()
		return nil, err
	}

	return s, nil
}

func (s *NfQueuePacketSource) ReadPacketData() (data []byte, ci gopacket.CaptureInfo, err error) {
	pkt := <-s.packets
	data = pkt.Payload
	// id := new(uint32)
	// *id = pkt.PacketID
	ci.AncillaryData = append(ci.AncillaryData, interface{}(pkt.PacketID), interface{}(s.nf))
	ci.CaptureLength = len(data)
	ci.Length = len(data)
	ci.Timestamp = pkt.Timestamp
	return
}
