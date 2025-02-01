package main

import (
	"log"
	"os"

	"github.com/go-yaml/yaml"

	"ethanclark.xyz/commander/passgen"
)

type EndpointConfig struct {
	// Name of endpoint (Try to limit to alphanumeric/underscores/hyphens/periods, please. This eventually ends up in a file path)
	Host      string            // IP or domain name
	Port      int               // Port (Default 22)
	User      string            // User to log in as
	Passwords []string          // Passwords to try
	Keys      []string          // Private keys to try
	Env       map[string]string // Hard coded environment variables
}

type Config struct {
	Endpoints map[string]EndpointConfig // List of endpoints (Key is endpoint name)
	Scripts   string                    // Path to directory of scripts
	Output    string                    // Path to directory to store script output in
	WWW       string                    // Path to directory of static web files
	Passwords []string                  // Global Passwords to try
	Keys      []string                  // Global keys to try
	Env       map[string]string         // Global environment variables
	Passgen   passgen.PassgenOptions    // Passgen Config
	Database  string                    // Path to the script database
	HTDigest  string                    // Path to .htdigest file for webui
}

func loadConfig(path string) Config {
	// Load the file
	configData, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Unable to read config at '%s': %s\n", path, err.Error())
	}

	// Parse the file
	config := Config{
		Scripts:  "scripts",
		Output:   "out",
		WWW:      "www",
		Database: "data.db",
		HTDigest: ".htdigest",
		Passgen: passgen.PassgenOptions{
			Rounds:       1000,
			Words:        2,
			WordLength:   5,
			Numbers:      2,
			NumberLength: 4,
		},
	}
	err = yaml.Unmarshal(configData, &config)
	if err != nil {
		log.Fatalf("Unable to parse config at '%s': %s\n", path, err.Error())
	}

	// Set defaults
	// if config.Passgen.Rounds == 0 {
	// 	config.Passgen.Rounds = 1000
	// }
	// if config.Passgen.Words == 0 {
	// 	config.Passgen.Words = 2
	// }
	// if config.Passgen.WordLength == 0 {
	// 	config.Passgen.WordLength = 5
	// }
	// if config.Passgen.Numbers == 0 {
	// 	config.Passgen.Numbers = 2
	// }
	// if config.Passgen.NumberLength == 0 {
	// 	config.Passgen.NumberLength = 4
	// }
	// if config.HTDigest == "" {
	// 	config.HTDigest = ".htdigest"
	// }

	// Make sure things aren't nil
	// if config.Env == nil {
	// 	config.Env = make(map[string]string)
	// }
	// for i := range config.Endpoints {
	// 	if config.Endpoints[i].Env == nil {
	// 		config.Endpoints[i].Env = make(map[string]string)
	// 	}
	// }

	return config
}

/*
func main() {
	config := loadConfig("config.yaml")
	fmt.Println(config)
} // */
