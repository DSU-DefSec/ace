package main

import (
	"net"
)

type connerrpair struct {
	conn net.Conn
	err  error
}

type MultiListener struct {
	listeners map[net.Listener]bool
	connChan  chan connerrpair
}

func NewMultiListener() *MultiListener {
	ret := new(MultiListener)
	ret.listeners = make(map[net.Listener]bool)
	ret.connChan = make(chan connerrpair)
	return ret
}

func (multilistener *MultiListener) Add(listener net.Listener) {
	multilistener.listeners[listener] = true
	go func() {
		for multilistener.listeners[listener] {
			conn, err := listener.Accept()
			multilistener.connChan <- connerrpair{conn, err}
		}
	}()
}

func (multilistener *MultiListener) Remove(listener net.Listener) error {
	multilistener.listeners[listener] = false
	return listener.Close()
}

func (multilistener MultiListener) Accept() (net.Conn, error) {
	pair := <-multilistener.connChan
	return pair.conn, pair.err
}

func (multilistener MultiListener) Close() error {
	var finalErr error
	for listener := range multilistener.listeners {
		multilistener.listeners[listener] = false
	}
	for listener := range multilistener.listeners {
		err := listener.Close()
		if err != nil {
			finalErr = err
		}
	}
	return finalErr
}

type MultiListenerAddr struct{}

func (addr MultiListenerAddr) Network() string {
	return "multi"
}

func (addr MultiListenerAddr) String() string {
	return "multi"
}

func (multilistener MultiListener) Addr() net.Addr {
	return MultiListenerAddr{}
}
