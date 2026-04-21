package config

import "os"

// AppConfig holds all environment-based configuration for the application.
type AppConfig struct {
	BFFPort      string
	DatabaseURL  string
	KafkaBrokers string
	RedisAddr    string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *AppConfig {
	return &AppConfig{
		BFFPort:      getEnv("BFF_PORT", "8081"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgres://rsias_user:rsias_password@localhost:5433/rsias_db"),
		KafkaBrokers: getEnv("KAFKA_BROKERS", "localhost:9092"),
		RedisAddr:    getEnv("REDIS_ADDR", "localhost:6379"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
