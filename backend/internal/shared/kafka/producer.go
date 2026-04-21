package kafka

import (
	"context"
	"fmt"
	"log"

	kafkago "github.com/segmentio/kafka-go"
)

// Producer wraps a Kafka writer for publishing messages.
type Producer struct {
	writer *kafkago.Writer
}

// NewProducer creates a new Kafka producer for the given topic.
func NewProducer(brokers []string, topic string) *Producer {
	return &Producer{
		writer: &kafkago.Writer{
			Addr:     kafkago.TCP(brokers...),
			Topic:    topic,
			Balancer: &kafkago.LeastBytes{},
		},
	}
}

// SendMessage publishes a key-value message to the configured topic.
func (p *Producer) SendMessage(ctx context.Context, key, value []byte) error {
	err := p.writer.WriteMessages(ctx, kafkago.Message{
		Key:   key,
		Value: value,
	})
	if err != nil {
		return fmt.Errorf("failed to write message: %w", err)
	}
	log.Printf("Message sent to topic %s: %s", p.writer.Topic, string(key))
	return nil
}

// Close shuts down the Kafka writer.
func (p *Producer) Close() error {
	return p.writer.Close()
}
