package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"

	"crypto/md5"
	"crypto/sha1"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"

	"github.com/apokalyptik/phpass"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/pbkdf2"
)

func main() {
	// Ensure that a file path and password are provided as command-line arguments
	if len(os.Args) < 3 {
		fmt.Println("Usage: go run main.go <file_path> <password>")
		return
	}

	// Get the file path and password from command-line arguments
	filePath := os.Args[1]
	password := os.Args[2]

	// Open the file
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// Define regex patterns for various hash types and count map for replacements
	hashPatterns := map[string]string{
		"MD5":               `'[a-fA-F0-9]{32}'`,
		"SHA1":              `'[a-fA-F0-9]{40}'`,
		"SHA256":            `'[a-fA-F0-9]{64}'`,
		"PHPMD5":            `'\$P\$[0-9a-zA-Z.\/]{31}'`,
		"SHA512":            `'[a-fA-F0-9]{128}'`,
		"DES":               `'[a-z0-9\/.]{12}[.26AEIMQUYcgkosw]{1}'`,
		"HALFMD5":           `'[a-f0-9]{16}'`,
		"PRESTASHOP":        `'[a-f0-9]{32}:[a-z0-9]{56}'`,
		"MD2":               `'(\$md2\$)?[a-f0-9]{32}$'`,
		"MD5CRYPT":          `'\$1\$[a-z0-9\/.]{0,8}\$[a-z0-9\/.]{22}(:.*)?'`,
		"PHPBB":             `'\$H\$[a-z0-9\/.]{31}'`,
		"PALSHOP":           `'[a-f0-9]{51}'`,
		"BCRYPT":            `'(\$2[abxy]?|\$2)\$[0-9]{2}\$[a-zA-Z0-9\/.]{53}'`,
		"YESCRYPT":          `'\$y\$[.\/A-Za-z0-9]+\$[.\/a-zA-Z0-9]+\$[.\/A-Za-z0-9]{43}'`,
		"JOOMLA":            `'[a-f0-9]{32}:[a-z0-9]{32}'`,
		"PBKDF-HMAC-SHA512": `'\$ml\$[0-9]+\$[a-f0-9]{64}\$[a-f0-9]{128}'`,
		"DJANGO":            `'sha256\$[a-z0-9]+\$[a-f0-9]{64}'`,
		"MEDIAWIKI":         `'[:\$][AB][:\$]([a-f0-9]{1,8}[:\$])?[a-f0-9]{32}'`,
		"Hmailserver":       `'[a-f0-9]{70}'`,
		"PHPS":              `'\$PHPS\$.+\$[a-f0-9]{32}'`,
	}

	// Map to store replacement counts for each hash type
	replacementCounts := make(map[string]int)

	// Compile the regular expression patterns
	hashRegexes := make(map[string]*regexp.Regexp)
	for hashType, pattern := range hashPatterns {
		r, err := regexp.Compile(pattern)
		if err != nil {
			fmt.Printf("Error compiling regular expression for %s: %s\n", hashType, err)
			return
		}
		hashRegexes[hashType] = r
	}
	tempFile, err := os.CreateTemp("", "tempfile.*.txt")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		return
	}
	defer os.Remove(tempFile.Name())
	defer tempFile.Close()
	
	// Read the file line by line
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		// Check for matches with each hash type
		for hashType, regex := range hashRegexes {
			matches := regex.FindAllString(line, -1)
			if len(matches) > 0 {
				// Increment the replacement count for this hash type
				replacementCounts[hashType] += len(matches)

				switch hashType {
				case "MD5":
					// Replace each MD5 hash with a new hash of the provided password
					for _, match := range matches {
						fmt.Println(match)
						hasher := md5.New()
						hasher.Write([]byte(password))
						newHash := "'" + hex.EncodeToString(hasher.Sum(nil)) + "'"
						line = regex.ReplaceAllString(line, newHash)
					}
				case "SHA1":
					// Replace each SHA1 hash with a new hash of the provided password
					for _, match := range matches {
						fmt.Println(match)
						hasher := sha1.New()
						hasher.Write([]byte(password))
						newHash := "'" + hex.EncodeToString(hasher.Sum(nil)) + "'"
						line = regex.ReplaceAllString(line, newHash)
					}
				case "SHA256":
					// Replace each SHA256 hash with a new hash of the provided password
					for _, match := range matches {
						fmt.Println(match)
						hasher := sha256.New()
						hasher.Write([]byte(password))
						newHash := "'" + hex.EncodeToString(hasher.Sum(nil)) + "'"
						line = regex.ReplaceAllString(line, newHash)
					}
				case "SHA512":
					// Replace each SHA512 hash with a new hash of the provided password
					for _, match := range matches {
						fmt.Println(match)
						hasher := sha512.New()
						hasher.Write([]byte(password))
						newHash := "'" + hex.EncodeToString(hasher.Sum(nil)) + "'"
						line = regex.ReplaceAllString(line, newHash)
					}
				case "PHPMD5":
					// Replace each PHPMD5 hash with a new hash of the provided password
					for _, match := range matches {
						fmt.Println(match)
						hasher := phpass.New(nil)
						newHash, err := hasher.Hash([]byte(password))
						if err != nil {
							fmt.Println("Error hashing password with PHPMD5:", err)
							return
						}
						newHashStr := "'" + string(newHash) + "'"
						line = regex.ReplaceAllString(line, newHashStr)
					}
				case "BCRYPT":
					// Replace each BCRYPT hash with a new hash of the provided password
					for _, match := range matches {
						fmt.Println(match)
						bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
						if err != nil {
							fmt.Println("Error hashing password with BCRYPT:", err)
							return
						}
						newHashStr := "'" + string(bytes) + "'"
						line = regex.ReplaceAllString(line, newHashStr)
					}
				case "PBKDF-HMAC-SHA512":
					// Replace each PBKDF-HMAC-SHA512 hash with a new hash of the provided password
					for _, match := range matches {
						fmt.Println(match)
						salt := "TechicallyWereBetter"
						newHash := pbkdf2.Key([]byte(password), []byte(salt), 4096, 64, sha512.New)
						newHashStr := "'" + hex.EncodeToString(newHash) + "'"
						line = regex.ReplaceAllString(line, newHashStr)
					}
				}
			}
		}

		// Write the modified line to a temporary file
		fmt.Fprintln(tempFile, line)
	}
	for hashType, count := range replacementCounts {
		fmt.Printf("%s hashes replaced: %d\n", hashType, count)
	}
	// Check for any scanning errors
	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	// Close the temporary file
	tempFile.Close()

	// Remove the original file
	if err := os.Remove(filePath); err != nil {
		fmt.Println("Error removing original file:", err)
		return
	}
	if err := os.Rename(tempFile.Name(), filePath); err != nil {
		fmt.Println("Error renaming temporary file:", err)
		return
	}
}
