package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"

	"github.com/jackc/pgx/v5"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://rsias_user:rsias_password@localhost:5433/rsias_db"
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	// Create migrations table if it doesn't exist
	_, err = conn.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		log.Fatalf("Unable to create migrations table: %v\n", err)
	}

	migrationDir := "migrations"
	files, err := os.ReadDir(migrationDir)

	if err != nil {
		log.Fatalf("Unable to read migrations directory: %v\n", err)
	}

	var migrationFiles []string
	for _, f := range files {
		if !f.IsDir() && filepath.Ext(f.Name()) == ".sql" {
			migrationFiles = append(migrationFiles, f.Name())
		}
	}
	sort.Strings(migrationFiles)

	for _, fileName := range migrationFiles {
		var exists bool
		err = conn.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version=$1)", fileName).Scan(&exists)
		if err != nil {
			log.Fatalf("Error checking migration %s: %v\n", fileName, err)
		}

		if exists {
			fmt.Printf("Migration %s already applied\n", fileName)
			continue
		}

		fmt.Printf("Applying migration %s...\n", fileName)
		content, err := os.ReadFile(filepath.Join(migrationDir, fileName))
		if err != nil {
			log.Fatalf("Error reading migration %s: %v\n", fileName, err)
		}

		tx, err := conn.Begin(ctx)
		if err != nil {
			log.Fatalf("Error starting transaction for %s: %v\n", fileName, err)
		}

		_, err = tx.Exec(ctx, string(content))
		if err != nil {
			tx.Rollback(ctx)
			log.Fatalf("Error applying migration %s: %v\n", fileName, err)
		}

		_, err = tx.Exec(ctx, "INSERT INTO schema_migrations (version) VALUES ($1)", fileName)
		if err != nil {
			tx.Rollback(ctx)
			log.Fatalf("Error recording migration %s: %v\n", fileName, err)
		}

		err = tx.Commit(ctx)
		if err != nil {
			log.Fatalf("Error committing migration %s: %v\n", fileName, err)
		}
		fmt.Printf("Successfully applied %s\n", fileName)
	}

	fmt.Println("All migrations applied successfully")
}
