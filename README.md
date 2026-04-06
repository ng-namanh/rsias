# RSIAS (Real-time Stock & Impact Analysis System)

RSIAS is a high-performance, polyglot microservices platform designed for real-time market data ingestion and AI-driven sentiment analysis.

## 🏗️ Architecture
The system is built with a decoupled, event-driven architecture:
- **Backend (Golang)**: Handles high-concurrency tasks like API Gateway, Authentication, and WebSocket broadcasting (BFF).
- **AI Worker (Python)**: Dedicated to the NLP pipeline, including sentiment analysis and RAG-based risk assessment.
- **Frontend (React/TS)**: A modern dashboard built with Vite and Bun.
- **Infrastructure**: Uses Kafka as the central nervous system, TimescaleDB for time-series data, and Redis for snapshots.

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Language** | Go 1.26+, Python 3.13+ |
| **Frontend** | React, TailwindCSS, Bun |
| **Messaging** | Apache Kafka |
| **Database** | PostgreSQL (TimescaleDB + pgvector) |
| **Cache** | Redis |
| **API** | gRPC (Internal), WebSockets (Real-time) |

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Go 1.26+
- Python 3.13+ & [uv](https://github.com/astral-sh/uv)
- [Bun](https://bun.sh/)

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Run Backend (Go)
```bash
cd backend
go run cmd/bff/main.go
```

### 3. Run AI Worker (Python)
```bash
cd ai-worker
uv run main.py
```

### 4. Run Frontend (Bun)
```bash
cd frontend
bun dev
```

## 📂 Project Structure
- `backend/`: Core Go logic, gRPC servers, and Kafka producers.
- `ai-worker/`: Python-based AI services and Kafka consumers.
- `frontend/`: React dashboard.
- `shared/proto/`: Protobuf definitions for cross-service communication.
- `specs/`: Detailed project specifications and implementation plans.

## 📜 Documentation
For deep dives into specific implementations, check out our [specs/](./specs/001-rsias-core-engine/spec.md) or the **Obsidian Second Brain** logs in \`raw/mentor-logs/\`.
