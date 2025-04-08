package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"
	"strconv"
    "os"
	"io"
	_ "github.com/mattn/go-sqlite3"
)
const (
	username = "admin"
	password = "secret"
)

type Config struct {
	Responses map[string]Response `json:"responses"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Response struct {
	Commands map[int]string `json:"commands"`
}
var passgenSecret string
var config Config

var logWriter io.Writer = os.Stdout

func init() {
	logFile, err := os.OpenFile("output.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Failed to open log file: %v", err)
	}

	logWriter := io.MultiWriter(os.Stdout, logFile)
	log.SetOutput(logWriter)
	log.SetFlags(log.LstdFlags | log.Lshortfile) // Add timestamps & file info
}
// FalconStruct defines the structure of incoming JSON data
type FalconStruct struct {
	Hostname     string                 `json:"hostname"`
	Output       string                 `json:"output"`
	Priority     string                 `json:"priority"`
	Rule         string                 `json:"rule"`
	Source       string                 `json:"source"`
	Tags         []string               `json:"tags"`
	Time         string                 `json:"time"`
	OutputFields map[string]interface{} `json:"output_fields"` // Dynamic key-value map
}

// CombinedAuthMiddleware handles both basic auth and localhost restrictions
func CombinedAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Skip authentication for /submit endpoint
		if r.Method == http.MethodPost && r.URL.Path == "/submit" {
			next.ServeHTTP(w, r)
			return
		}
		// Apply basic auth for all other paths
		user, pass, ok := r.BasicAuth()
		if !ok || user != config.Username || pass != config.Password {
			w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
			http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
func geteventhandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Check if the request method is GET
		if r.Method != http.MethodGet {
			http.Error(w, `{"error": "Invalid request method, only GET allowed"}`, http.StatusMethodNotAllowed)
			return
		}

		defer r.Body.Close()

		// Get the 'id' query parameter
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, `{"error": "Missing 'id' query parameter"}`, http.StatusBadRequest)
			return
		}

		// SQL query to retrieve event data
		querySQL := `SELECT ip_address, hostname, id, priority, rule, source, output, time FROM events WHERE ID=?`


		// Execute the query with the provided ID
		row := db.QueryRow(querySQL, id) // Use QueryRow for single result

		// Variables to hold the column values
		var ipAddress, hostname, rule, source, output, time string
		var idInt, priority string

		// Scan the single row result into variables
		err := row.Scan(&ipAddress, &hostname, &idInt, &priority, &rule, &source, &output, &time)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, `{"error": "No result found for the provided ID"}`, http.StatusNotFound)
			} else {
				http.Error(w, `{"error": "Failed to execute query: `+err.Error()+`"}`, http.StatusInternalServerError)
			}
			return
		}

		// Print the output field
		pairs := strings.Fields(output)
		resultp2 := make(map[string]string)
		for _, pair := range pairs {
			// Split each pair at '='
			parts := strings.SplitN(pair, "=", 2)
			if len(parts) == 2 {
				resultp2[parts[0]] = parts[1]
			}
		}
		// Prepare the result map for the single row
		result := map[string]interface{}{
			"ip_address": ipAddress,
			"hostname":   hostname,
			"id":         idInt,
			"priority":   priority,
			"rule":       rule,
			"source":     source,
			"time":       time,
		}
        for key, value := range resultp2 {
			result[key] = value
		}
		// Convert the result to JSON
		jsonData, err := json.Marshal(result)
		if err != nil {
			http.Error(w, `{"error": "Failed to encode JSON: `+err.Error()+`"}`, http.StatusInternalServerError)
			return
		}

		// Send JSON response with content type set to application/json
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
	}
}



func gettableapi(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
            http.Error(w, `{"error": "Invalid request method"}`, http.StatusMethodNotAllowed)
            return
        }

        // Read query parameters
        limit := r.URL.Query().Get("limit")
        offset := r.URL.Query().Get("offset")
        search := r.URL.Query().Get("search")
        orderColumn := r.URL.Query().Get("orderColumn")
        orderDir := r.URL.Query().Get("orderDir")

        // Set default values
        if limit == "" {
            limit = "10"
        }
        if offset == "" {
            offset = "0"
        }

        // Parse parameters
        limitInt, _ := strconv.Atoi(limit)
        offsetInt, _ := strconv.Atoi(offset)

        // Build the base query
        baseQuery := `SELECT ip_address, hostname, id, priority, rule, source, time FROM events`
        countQuery := `SELECT COUNT(*) FROM events`
        
        // Add search condition if search parameter is present
        var whereClause string
        var params []interface{}
		if search != "" {
			whereClause = ` WHERE hostname LIKE ? OR ip_address LIKE ? OR rule LIKE ? OR source LIKE ?`
			searchPattern := "%" + search + "%"
			params = append(params, searchPattern, searchPattern, searchPattern, searchPattern)
			baseQuery += whereClause
			countQuery += whereClause
		}
		

        // Add ordering
        if orderColumn != "" && orderDir != "" {
            // Validate order column to prevent SQL injection
            validColumns := map[string]bool{
                "id": true, "ip_address": true, "hostname": true,
                "priority": true, "rule": true, "source": true, "time": true,
            }
            if validColumns[orderColumn] {
                // Validate order direction
                if orderDir == "asc" || orderDir == "desc" {
                    baseQuery += fmt.Sprintf(" ORDER BY %s %s", orderColumn, orderDir)
                }
            }
        }

        // Add pagination
        baseQuery += " LIMIT ? OFFSET ?"
        params = append(params, limitInt, offsetInt)

        // Get total count of filtered rows
        var filteredRows int
        if err := db.QueryRow(countQuery, params[:len(params)-2]...).Scan(&filteredRows); err != nil {
            http.Error(w, `{"error": "Failed to get filtered count"}`, http.StatusInternalServerError)
            return
        }

        // Execute the main query
        rows, err := db.Query(baseQuery, params...)
        if err != nil {
            http.Error(w, `{"error": "Failed to execute query"}`, http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        // Process results
        var results []map[string]interface{}
        columns, _ := rows.Columns()
        
        for rows.Next() {
            values := make([]interface{}, len(columns))
            valuePointers := make([]interface{}, len(columns))
            for i := range values {
                valuePointers[i] = &values[i]
            }

            if err := rows.Scan(valuePointers...); err != nil {
                http.Error(w, `{"error": "Failed to scan row"}`, http.StatusInternalServerError)
                return
            }

            rowMap := make(map[string]interface{})
            for i, colName := range columns {
                if b, ok := values[i].([]byte); ok {
                    rowMap[colName] = string(b)
                } else {
                    rowMap[colName] = values[i]
                }
            }
            results = append(results, rowMap)
        }

        // Get total count (unfiltered)
        var totalRows int
        err = db.QueryRow("SELECT COUNT(*) FROM events").Scan(&totalRows)
        if err != nil {
            http.Error(w, `{"error": "Failed to get total count"}`, http.StatusInternalServerError)
            return
        }

        // Prepare response
        response := map[string]interface{}{
            "data":          results,
            "totalRows":     totalRows,
            "filteredRows": filteredRows,
            "limit":         limitInt,
            "offset":        offsetInt,
        }

        // Send response
        w.Header().Set("Content-Type", "application/json")
        jsonData, _ := json.Marshal(response)
        w.Write(jsonData)
    }
}



// handler processes incoming POST requests and stores the JSON data in SQLite
func handler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		// Get the client IP address
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			http.Error(w, "Failed to get client IP", http.StatusInternalServerError)
			return
		}

		// Decode incoming JSON request
		var data FalconStruct
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&data); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Print the incoming data and client IP for debugging
		fmt.Printf("Received alert from IP: %s, Data: %+v\n", ip, data)

		// Convert tags to a comma-separated string
		tags := strings.Join(data.Tags, ",")

		// Convert OutputFields to JSON string
		outputFieldsJSON, err := json.Marshal(data.OutputFields)
		if err != nil {
			http.Error(w, "Failed to serialize OutputFields", http.StatusInternalServerError)
			return
		}
		generateResponse(data,config,ip,passgenSecret)

		// Insert JSON data into the database
		insertSQL := `INSERT INTO events (hostname, output, priority, rule, source, tags, time, output_fields, ip_address)
					  VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?)`
		_, err = db.Exec(insertSQL, data.Hostname, data.Output, data.Priority, data.Rule, data.Source, tags, data.Time, string(outputFieldsJSON), ip)
		if err != nil {
			http.Error(w, "Failed to insert into database", http.StatusInternalServerError)
			return
		}

		// Send success response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Alert received and stored successfully!"})
	}
}


type SecuredFileServer struct {
	fs http.Handler
}

// ServeHTTP implements the http.Handler interface
func (sfs SecuredFileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	sfs.fs.ServeHTTP(w, r)
}

func main() {
	if len(os.Args) != 4 {
		fmt.Println("Usage: ./falcologgingserver <IP> <PORT> <PASSGEN>")
		os.Exit(1)
	}

	ip := os.Args[1]
	port := os.Args[2]
	passgenSecret = os.Args[3]
	addr := fmt.Sprintf("%s:%s", ip, port)
	// Open SQLite database
	db, err := sql.Open("sqlite3", "event.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Open config file
	file, err := os.Open("config.json")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return
	}

	// Create table if it does not exist
	createTableSQL := `CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		hostname TEXT,
		output TEXT,
		priority TEXT,
		rule TEXT,
		source TEXT,
		tags TEXT,
		time TEXT,
		output_fields TEXT,
		ip_address TEXT
	);`
	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}

	// Create a new mux
	mux := http.NewServeMux()

	// Register handlers
	mux.Handle("/", &SecuredFileServer{http.FileServer(http.Dir("./html"))})
	mux.HandleFunc("/submit", handler(db))
	mux.HandleFunc("/gettable", gettableapi(db))
	mux.HandleFunc("/getevent", geteventhandler(db))

	// Wrap the entire mux with the CombinedAuthMiddleware
	securedMux := CombinedAuthMiddleware(mux)

	// Start the server
	log.Printf("Server is running on %s\n", addr)
	if err := http.ListenAndServe(addr, securedMux); err != nil {
		log.Fatal(err)
	}
}