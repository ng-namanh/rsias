# API Contract: Company Fundamentals (MVP)

**Endpoint**: `GET /api/v1/companies/:symbol/fundamentals`
**Protocol**: REST / JSON

## Response (200 OK)

```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "sector": "Technology",
  "industry": "Consumer Electronics",
  "market_cap": 2500000000000,
  "pe_ratio": 28.50,
  "revenue_growth": 0.08,
  "updated_at": "2026-04-09T00:00:00Z"
}
```

## Error (404 Not Found)

```json
{
  "error": "Company not found",
  "code": "COMPANY_NOT_FOUND"
}
```
