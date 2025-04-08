package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func db2delim(db *sql.DB, q string, w http.ResponseWriter, fieldSeparator, recordSeparator string, mime string) {
	panicIfError := func(err error, w http.ResponseWriter, msg string) bool {
		if err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, "%s: %s", msg, err.Error())
			return true
		}
		return false
	}
	rows, err := db.Query(q)
	if panicIfError(err, w, "Unable to perform query") {
		return
	}

	cols, err := rows.Columns()
	if panicIfError(err, w, "Error getting columns") {
		return
	}
	rowData := make([]interface{}, len(cols))
	for i := range cols {
		rowData[i] = new(string)
	}

	w.Header().Add("Content-Type", mime)
	w.WriteHeader(200)
	for rows.Next() {
		rows.Scan(rowData...)
		for i, col := range rowData {
			fmt.Fprintf(w, "%s", *col.(*string))
			if i != len(rowData)-1 {
				fmt.Fprintf(w, "%s", fieldSeparator)
			}
		}
		fmt.Fprintf(w, "%s", recordSeparator)
	}
}

func db2json(db *sql.DB, q string, w http.ResponseWriter) {
	panicIfError := func(err error, w http.ResponseWriter, msg string) bool {
		if err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, "%s: %s\n", msg, err.Error())
			return true
		}
		return false
	}
	rows, err := db.Query(q)
	if panicIfError(err, w, "Unable to perform query") {
		return
	}

	cols, err := rows.Columns()
	if panicIfError(err, w, "Error getting columns") {
		return
	}

	// types, err := rows.ColumnTypes()
	// if panicIfError(err, w, "Error getting column types") {
	// return
	// }

	rowData := make([]interface{}, len(cols))
	jcols := make([][]byte, len(cols))
	for i, col := range cols {
		jcols[i], err = json.Marshal(col)
		if panicIfError(err, w, "Error marshalling column name to JSON") {
			return
		}
		rowData[i] = new(string)
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(200)
	fmt.Fprint(w, "[")
	first := true
	for rows.Next() {
		rows.Scan(rowData...)
		if first {
			first = false
		} else {
			fmt.Fprint(w, ",")
		}
		fmt.Fprint(w, "{")
		for i, col := range rowData {
			val, err := json.Marshal(*col.(*string))
			if panicIfError(err, w, "Error marshalling JSON") {
				return
			}
			fmt.Fprintf(w, "%s:%s", jcols[i], val)
			if i != len(rowData)-1 {
				fmt.Fprintf(w, ",")
			}
		}
		fmt.Fprintf(w, "}")
	}
	fmt.Fprint(w, "]")
}

type DBHandler struct {
	DB *sql.DB
}

func (dbh *DBHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var q []byte
	var err error
	if r.Method == "POST" {
		q, err = io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Unable to read request body: %s\n", err.Error())
			return
		}
	} else if r.Method == "GET" {
		q = []byte(r.FormValue("q"))
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "%s not allowed.\n", r.Method)
		return
	}

	// Everything in this block needs to write the HTTP header and content
	switch r.FormValue("format") {
	case "tsv":
		db2delim(dbh.DB, string(q), w, "\t", "\n", "text/tsv")
	case "csv":
		db2delim(dbh.DB, string(q), w, ",", "\n", "text/csv")
	case "json":
		db2json(dbh.DB, string(q), w)
	case "delimited":
		db2delim(dbh.DB, string(q), w, r.FormValue("fs"), r.FormValue("rs"), "text/plain")
	default:
		result, err := dbh.DB.Exec(string(q))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, "Invalid request: %s\n", err.Error())
		} else {
			affected, err := result.RowsAffected()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Query Maybe Successful: Unknown Rows Affected.\n%s\n", err.Error())
			} else {
				w.WriteHeader(http.StatusOK)
				fmt.Fprintf(w, "Query Successful: %d Row(s) Affected.\n", affected)
			}
		}
	}
}

// TODO: Refactor to allow access to the handler outside the function (For the webui)
// func DBListener(dbpath string, provider auth.SecretProvider) (*MultiListener, error) {
// 	// Open Database
// 	db, err := sql.Open("sqlite3", dbpath)
// 	if err != nil {
// 		return nil, err
// 	}

// 	authenticator := auth.NewDigestAuthenticator("Script Database", provider)
// 	nonces := make(map[string]bool)

// 	handler := func(w http.ResponseWriter, r *auth.AuthenticatedRequest) {
// 		nonce := r.FormValue("nonce")
// 		if len(nonce) < 64 {
// 			w.WriteHeader(http.StatusBadRequest)
// 			fmt.Fprintf(w, "Invalid nonce.\n")
// 			return
// 		}

// 		if nonces[nonce] {
// 			w.WriteHeader(http.StatusTeapot)
// 			fmt.Fprintf(w, "Already nonced that one, bud.\n")
// 			return
// 		}
// 		nonces[nonce] = true

// 		if r.Method != "POST" {
// 			w.WriteHeader(http.StatusMethodNotAllowed)
// 			fmt.Fprintf(w, "%s not allowed.\n", r.Method)
// 			return
// 		}

// 		q, err := io.ReadAll(r.Body)

// 		if err != nil {
// 			w.WriteHeader(http.StatusInternalServerError)
// 			fmt.Fprintf(w, "Unable to read request body: %s\n", err.Error())
// 			return
// 		}

// 		// Everything in this block needs to write the HTTP header and content
// 		switch r.FormValue("format") {
// 		case "tsv":
// 			db2delim(db, string(q), w, "\t", "\n", "text/tsv")
// 		case "csv":
// 			db2delim(db, string(q), w, ",", "\n", "text/csv")
// 		case "json":
// 			db2json(db, string(q), w)
// 		case "delimited":
// 			db2delim(db, string(q), w, r.FormValue("fs"), r.FormValue("rs"), "text/plain")
// 		default:
// 			result, err := db.Exec(string(q))
// 			if err != nil {
// 				w.WriteHeader(http.StatusBadRequest)
// 				fmt.Fprintf(w, "Invalid request: %s\n", err.Error())
// 			} else {
// 				affected, err := result.RowsAffected()
// 				if err != nil {
// 					w.WriteHeader(http.StatusInternalServerError)
// 					fmt.Fprintf(w, "Query (maybe) Successful: ??? Rows Affected.\n%s\n", err.Error())
// 				} else {
// 					w.WriteHeader(http.StatusOK)
// 					fmt.Fprintf(w, "Query Successful: %d Row(s) Affected.\n", affected)
// 				}
// 			}
// 		}
// 	}

// 	servemux := http.NewServeMux()
// 	servemux.HandleFunc("/db", authenticator.Wrap(handler))
// 	ml := NewMultiListener()

// 	go http.Serve(ml, servemux)
// 	return ml, nil
// }

/*
func main() {
	ml, err := DBListener("./database.db", auth.HtdigestFileProvider(".htdigest"))
	if err != nil {
		log.Fatalf("Unable to start HTTP: %s\n", err.Error())
	}

	l, err := net.Listen("tcp4", "127.0.0.1:8001")
	if err != nil {
		log.Fatalf("Unable to start listener: %s\n", err.Error())
	}

	ml.Add(l)
	fmt.Scanf("%s")
} // */
