package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"embed"

	"C"

	yara "github.com/VirusTotal/yara-x/go"
	"github.com/alexflint/go-arg"
	"github.com/corazawaf/coraza/v3"
	nfqueue "github.com/florianl/go-nfqueue/v2"
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/tcpassembly"
)
import "io/fs"

type Args struct {
	QueueNum        uint16   `arg:"-q,--queue-num,required" help:"NFQUEUE number to use"`
	Rules           []string `arg:"-r,--rules" help:"Paths to YARA rule files to override the builtin rules"`
	MaxStreamLength int      `arg:"-m,--max-stream-length" default:"65536" help:"Maximum length allowed for a TCP stream"`
}

//go:embed processed_rules
var rule_fs embed.FS

//go:embed waf_config
var coraza_fs embed.FS

func handle_packets(pkt_data_src *NfQueuePacketSource, rules *yara.Rules, max_bytes int) {
	cfg := coraza.
		NewWAFConfig().
		WithRootFS(coraza_fs).
		WithRequestBodyAccess().
		// WithDirectivesFromFile("waf_config/coraza.conf").
		WithDirectivesFromFile("waf_config/001-crs-setup.conf")

	paths, err := fs.Glob(coraza_fs, "waf_config/rules/*.conf")
	if err != nil {
		log.Fatal(err)
	}
	for _, path := range paths {
		cfg = cfg.WithDirectivesFromFile(path)
	}

	waf, err := coraza.NewWAF(cfg)
	if err != nil {
		log.Fatal(err)
	}

	streamFactory := &yaraStreamFactory{
		nf:         pkt_data_src.nf,
		id_map:     make(map[time.Time]uint32),
		rules:      rules,
		waf:        waf,
		max_length: max_bytes,
	}
	streamPool := tcpassembly.NewStreamPool(streamFactory)
	assembler := tcpassembly.NewAssembler(streamPool)

	decoder := layers.ProtocolGuessingDecoder{}
	pkt_src := gopacket.NewPacketSource(pkt_data_src, decoder)
	count := 0

	for pkt := range pkt_src.Packets() {
		count++
		// fmt.Printf("Processed %d packets\n", count)

		ci := pkt.Metadata().CaptureInfo
		id := ci.AncillaryData[0].(uint32)
		nf := ci.AncillaryData[1].(*nfqueue.Nfqueue)

		_, is_ip := pkt.Layer(layers.LayerTypeIPv4).(*layers.IPv4)
		tcp, is_tcp := pkt.Layer(layers.LayerTypeTCP).(*layers.TCP)
		udp, is_udp := pkt.Layer(layers.LayerTypeUDP).(*layers.UDP)
		icmp, is_icmp := pkt.Layer(layers.LayerTypeICMPv4).(*layers.ICMPv4)

		if !is_ip {
			nf.SetVerdict(id, nfqueue.NfDrop)
			continue
		}

		if is_tcp {
			// fmt.Println("New TCP Packet:", tcp.SrcPort, len(tcp.Payload), "Bytes", tcp.Checksum)
			streamFactory.id_map[ci.Timestamp] = id
			// assembler.FlushOlderThan(time.Now().Add(-time.Minute))
			assembler.AssembleWithTimestamp(pkt.NetworkLayer().NetworkFlow(), tcp, pkt.Metadata().Timestamp)
			continue
		}

		if is_udp {
			// fmt.Println("New UDP Packet:", udp.SrcPort, len(udp.Payload), "Bytes", udp.Checksum)
			results, err := rules.Scan(udp.Payload)
			if err != nil {
				nf.SetVerdict(id, nfqueue.NfDrop)
				continue
			}

			matches := results.MatchingRules()
			if len(matches) > 0 {
				nf.SetVerdict(id, nfqueue.NfDrop)
			} else {
				nf.SetVerdict(id, nfqueue.NfAccept)
			}
			continue
		}

		if is_icmp {
			if icmp.TypeCode == 8 || icmp.TypeCode == 0 {
				nf.SetVerdict(id, nfqueue.NfAccept)
			} else {
				nf.SetVerdict(id, nfqueue.NfDrop)
			}
			continue
		}

		fmt.Println("No Idea: ", id)
		nf.SetVerdict(id, nfqueue.NfDrop)
	}
}

func load_builtin_rules(compiler *yara.Compiler) error {
	entries, err := rule_fs.ReadDir("processed_rules")
	if err != nil {
		return err
	}
	for _, entry := range entries {
		name := "processed_rules/" + entry.Name()
		content, err := rule_fs.ReadFile(name)
		if err != nil {
			return err
		}

		err = compiler.AddSource(
			string(content),
			yara.WithOrigin(name),
		)
		if err != nil {
			fmt.Println(err)
			// return err
		}
	}
	return nil
}

//export main
func main() {
	var args Args
	arg.MustParse(&args)

	// Compile some YARA rules.
	compiler, err := yara.NewCompiler(
		yara.ConditionOptimization(true),
		// yara.ErrorOnSlowLoop(true),
		// yara.ErrorOnSlowPattern(true),
	)
	if err != nil {
		log.Fatalln(err)
	}

	if args.Rules == nil {
		err = load_builtin_rules(compiler)
		if err != nil {
			log.Fatalln(err)
		}
	} else {
		for _, path := range args.Rules {
			content, err := os.ReadFile(path)
			if err != nil {
				log.Fatalln(err)
			}

			err = compiler.AddSource(
				string(content),
				yara.WithOrigin(path),
			)
			if err != nil {
				log.Fatalln(err)
			}
		}
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	src, err := NewNfQueuePacketSource(ctx, args.QueueNum)
	if err != nil {
		log.Fatalln(err)
	}

	go handle_packets(src, compiler.Build(), args.MaxStreamLength)

	sig := make(chan os.Signal, 4)
	go func() {
		<-sig
		cancel()
	}()
	signal.Notify(sig, syscall.SIGTERM, syscall.SIGINT, syscall.SIGKILL)

	// Block till the context expires
	fmt.Printf("Listening on NFQUEUE %d...\n", args.QueueNum)
	<-ctx.Done()
}
