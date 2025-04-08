package main

import (
	"embed"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"time"
)

//go:embed www
var web_root embed.FS

// From https://gist.github.com/hyg/9c4afcd91fe24316cbf0
func open_browser(url string) {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}

}

func parse_args() (bind_addr *string) {
	bind_addr = flag.String("bind", "127.0.0.1:8080", "Specifies the address to listen on")

	flag.Parse()

	print_help := flag.Bool("help", false, "Prints this usage info")
	if *print_help {
		flag.PrintDefaults()
	}

	return
}

func main() {
	bind_addr := parse_args()

	go func() {
		// Hard coded delay my beloved
		time.Sleep(1)
		open_browser("http://" + *bind_addr + "/www/CyberChef_v10.19.4.html")
	}()

	log.Fatal(http.ListenAndServe(*bind_addr, http.FileServerFS(web_root)))
}
