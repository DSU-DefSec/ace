package main
import (
	"fmt"
	"regexp"
	"log"
)
var passgen_opts = PassgenOptions{
	Rounds:       1000,
	Words:        2,
	WordLength:   5,
	Numbers:      2,
	NumberLength: 4,
}


func generateResponse(event FalconStruct, config Config,ip string,passgenSecret string) {

	if response, exists := config.Responses[event.Rule]; exists {
		fmt.Println("Matched Rule:", event.Rule)
		for id, command := range response.Commands {
			re := regexp.MustCompile(`%(.*?)%`)
			placeholders := re.FindAllStringSubmatch(command, -1)

			if placeholders != nil {
				fmt.Printf("Placeholders Found: %v\n", placeholders)

				for _, match := range placeholders {
					if len(match) > 1 { 
						placeholder := match[1]

						// Check if the placeholder exists as a key in OutputFields
						if value, exists := event.OutputFields[placeholder]; exists {
							// Convert value to string (handle different types)
							valueStr := fmt.Sprintf("%v", value)
							command = regexp.MustCompile(fmt.Sprintf("%%%s%%", regexp.QuoteMeta(placeholder))).ReplaceAllString(command, valueStr)
							fmt.Printf("Placeholder matched: %s -> %s\n", placeholder, valueStr)
						}
					}
				}
			}
			fmt.Printf("Executing Command %d: %s\n", id, command)
			byteArray := []byte(passgenSecret+ip+"root")
			test := GeneratePassword(byteArray,passgen_opts)
			
			log.Printf("Generated Password %s \n",test)
			ip=ip+":22"
			
			output, err := ExecuteSSHCommand("root",test,ip,command)
			if err != nil {
				log.Println("Error executing command: ", err)
			}
			log.Println("Command output:", output)
		}
	} else {
		fmt.Println("No matching rule found in config.")
	}
}
