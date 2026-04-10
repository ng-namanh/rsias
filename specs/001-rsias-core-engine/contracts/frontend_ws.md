# WebSocket Contract: Enriched News Feed (MVP)

**Endpoint**: `ws://localhost:8081/ws/news`
**Protocol**: JSON over WebSockets

## Outbound Message (BFF -> Client)

### `news.enriched`
Sent whenever a news article has been processed by the AI worker.

```json
{
  "type": "news.enriched",
  "payload": {
    "id": "uuid-v4",
    "ticker": "AAPL",
    "headline": "Apple announces quarterly results",
    "summary": "...",
    "source": "Bloomberg",
    "url": "https://...",
    "published_at": "2026-04-09T10:00:00Z",
    "category": "Earnings/Corporate",
    "intelligence": {
      "sentiment_score": 0.85,
      "trust_score": 98.0,
      "rationale": {
        "source_reputation": "High",
        "consistency": "Consistent with historical data",
        "factual_grounding": "Direct citation from official filing"
      },
      "confidence": 0.95
    }
  }
}
```

### `heatmap.update`
Sent periodically to update the global category intensity.

```json
{
  "type": "heatmap.update",
  "payload": {
    "Macro": { "intensity": 0.7, "sentiment": 0.2 },
    "Geopolitical": { "intensity": 0.4, "sentiment": -0.8 },
    "Tech": { "intensity": 0.9, "sentiment": 0.5 }
  }
}
```
