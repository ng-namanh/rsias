package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/segmentio/kafka-go"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all for development
		},
	}
	clients = make(map[*websocket.Conn]bool)
	clientsMu sync.Mutex
)

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
	log.Printf("Error upgrading to WebSocket: %v", err)
		return
	}
	defer conn.Close()

	clientsMu.Lock()
	clients[conn] = true
	clientsMu.Unlock()

	log.Println("New WebSocket client connected")

	// Keep-alive loop
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Client disconnected: %v", err)
			clientsMu.Lock()
			delete(clients, conn)
			clientsMu.Unlock()
			break
		}
	}
}

func consumeAndBroadcast(ctx context.Context, brokers []string, topic string) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: brokers,
		Topic:   topic,
		GroupID: "bff-broadcaster",
	})
	defer r.Close()

	log.Printf("BFF starting to consume from %s", topic)

	for {
		m, err := r.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading from Kafka: %v", err)
			return
		}

		clientsMu.Lock()
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, m.Value)
			if err != nil {
				log.Printf("Error writing to client: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
		clientsMu.Unlock()
	}
}

func main() {
	ctx := context.Background()
	brokers := []string{"localhost:9092"}

	// Start Kafka consumers for ticks and news in parallel
	go consumeAndBroadcast(ctx, brokers, "market.ticks")
	go consumeAndBroadcast(ctx, brokers, "news.enriched")
	go consumeAndBroadcast(ctx, brokers, "news.fundamentals")

	http.HandleFunc("/ws", handleWebSocket)

	http.HandleFunc("/api/v1/companies/", func(w http.ResponseWriter, r *http.Request) {
		// Basic routing for /api/v1/companies/:symbol/fundamentals
		// In a real app, use a router like chi or gorilla/mux
		path := r.URL.Path
		log.Printf("BFF: Received request %s", path)
		// ... logic to parse and return fundamentals from database or cache
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"symbol": "AAPL", "name": "Apple Inc.", "market_cap": 2800000000000, "pe_ratio": 28.5, "revenue_growth": 11.2}`)
	})

	log.Println("BFF WebSocket server starting on :8081")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal(err)
	}
}
