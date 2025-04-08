package main

import (
	"bufio"
	"encoding/json"
	"io"
	"log"
	"strings"
	"time"
)

type AsciiCastEvent struct {
	Time float64
	Code string
	Data string
}

type AsciiCast struct {
	StartTime time.Time
	Timestamp int64             `json:"timestamp"`
	Version   int               `json:"version"`
	Width     int               `json:"width"`
	Height    int               `json:"height"`
	Title     string            `json:"title"`
	Env       map[string]string `json:"env"`
	Events    []AsciiCastEvent  `json:"-"`
}

func LoadAsciiCast(r io.Reader) AsciiCast {
	var ret AsciiCast
	s := bufio.NewScanner(r)
	if s.Scan() {
		json.Unmarshal(s.Bytes(), &ret)
	}

	for s.Scan() {
		var event []interface{}
		if len(s.Bytes()) == 0 {
			continue
		}
		err := json.Unmarshal(s.Bytes(), &event)
		if err != nil {
			log.Fatalln(err.Error())
		}
		ret.Events = append(ret.Events, AsciiCastEvent{
			Time: event[0].(float64),
			Code: event[1].(string),
			Data: event[2].(string),
		})
	}

	return ret
}

func (ac *AsciiCast) Write(p []byte) (int, error) {
	data := string(p)
	// TODO: replace with better regex
	data = strings.ReplaceAll(data, "\n", "\r\n")
	ac.Events = append(ac.Events, AsciiCastEvent{
		Code: "o",
		Time: float64(time.Since(ac.StartTime)) / float64(time.Second),
		Data: data,
	})
	return len(p), nil
}

func (ac *AsciiCast) String() string {
	var ret strings.Builder
	for _, event := range ac.Events {
		if event.Code == "o" {
			ret.WriteString(event.Data)
		}
	}
	return ret.String()
}

func (ac *AsciiCast) Serialize() string {
	var ret []string

	// Header
	header, err := json.Marshal(ac)
	if err != nil {
		log.Fatalln(err.Error())
	}
	ret = append(ret, string(header))

	// Events
	for _, event := range ac.Events {
		e, err := json.Marshal([]any{event.Time, event.Code, event.Data})
		if err != nil {
			log.Fatalln(err.Error())
		}
		ret = append(ret, string(e))
	}
	return strings.Join(ret, "\n") + "\n"
}

type AsciiCastWriter struct {
	W           io.Writer
	Start       time.Time
	Paginate    int
	CurrentLine int
}

func NewAsciiCastWriter(writer io.Writer, width, height int, timestamp time.Time, command, title string, env map[string]string) (AsciiCastWriter, error) {
	ac := AsciiCastWriter{
		Start:       timestamp,
		W:           writer,
		CurrentLine: 0,
	}
	header := make(map[string]interface{})
	header["width"] = width
	header["height"] = height
	header["timestamp"] = timestamp.Unix()
	header["command"] = command
	header["title"] = title
	header["env"] = env
	header["version"] = 2
	out, err := json.Marshal(header)
	if err != nil {
		return ac, err
	}
	out = append(out, 0x0A)
	_, err = ac.W.Write(out)
	if err != nil {
		return ac, err
	}
	return ac, nil
}

func (ac *AsciiCastWriter) Write(p []byte) (n int, err error) {
	data := strings.Split(string(p), "\n")
	for i, line := range data {
		if i < len(data)-1 {
			line += "\r\n"
			ac.CurrentLine++
		}
		if line == "" {
			continue
		}
		if ac.Paginate > 0 && ac.CurrentLine > ac.Paginate {
			ac.WriteMarker("")
			ac.CurrentLine = 0
		}
		e, err := json.Marshal([]any{float64(time.Since(ac.Start)) / float64(time.Second), "o", line})
		if err != nil {
			return 0, err
		}
		e = append(e, 0x0A) // Newline
		n, err = ac.W.Write(e)
		if err != nil {
			return n, err
		}
	}

	return len(p), nil
}

func (ac *AsciiCastWriter) WriteMarker(name string) error {
	e, err := json.Marshal([]any{float64(time.Since(ac.Start)) / float64(time.Second), "m", name})
	if err != nil {
		return err
	}
	e = append(e, 0x0A) // Newline
	_, err = ac.W.Write(e)
	if err != nil {
		return err
	}
	return nil
}
