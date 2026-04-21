package websocket

import (
	"context"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	ws "github.com/gorilla/websocket"
	kafkago "github.com/segmentio/kafka-go"
)

// Hub manages WebSocket client connections and Kafka-to-client broadcasting.
type Hub struct {
	upgrader  ws.Upgrader
	clients   map[*ws.Conn]bool
	clientsMu sync.Mutex
}

// NewHub creates a new WebSocket hub.
func NewHub() *Hub {
	return &Hub{
		upgrader: ws.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // Allow all origins for development
			},
		},
		clients: make(map[*ws.Conn]bool),
	}
}

// HandleWebSocket is the Gin handler for upgrading HTTP connections to WebSocket.
func (h *Hub) HandleWebSocket(c *gin.Context) {
	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Error upgrading to WebSocket: %v", err)
		return
	}
	defer conn.Close()

	h.clientsMu.Lock()
	h.clients[conn] = true
	h.clientsMu.Unlock()

	log.Println("New WebSocket client connected")

	// Keep-alive read loop
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Client disconnected: %v", err)
			h.clientsMu.Lock()
			delete(h.clients, conn)
			h.clientsMu.Unlock()
			break
		}
	}
}

// ConsumeAndBroadcast reads from a Kafka topic and broadcasts messages to all connected WebSocket clients.
func (h *Hub) ConsumeAndBroadcast(ctx context.Context, brokers []string, topic string) {
	r := kafkago.NewReader(kafkago.ReaderConfig{
		Brokers: brokers,
		Topic:   topic,
		GroupID: "bff-broadcaster",
	})
	defer r.Close()

	log.Printf("WebSocket Hub: consuming from %s", topic)

	for {
		m, err := r.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading from Kafka topic %s: %v", topic, err)
			return
		}

		h.clientsMu.Lock()
		for client := range h.clients {
			err := client.WriteMessage(ws.TextMessage, m.Value)
			if err != nil {
				log.Printf("Error writing to WS client: %v", err)
				client.Close()
				delete(h.clients, client)
			}
		}
		h.clientsMu.Unlock()
	}
}
