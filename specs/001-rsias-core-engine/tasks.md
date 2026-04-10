# Tasks: RSIAS Core Engine (MVP: Intelligence First)

**Feature**: RSIAS Core Engine  
**Milestone**: 1 (MVP)  
**Status**: Generated  

---

## Phase 1: Setup

- [x] T001 Initialize backend project structure for producers and BFF in `backend/`
- [x] T002 Initialize AI-worker environment and dependencies in `ai-worker/pyproject.toml`
- [x] T003 Configure Kafka topics `news.raw`, `news.enriched`, and `news.fundamentals` in `docker-compose.yml`
- [x] T004 Setup database migration tool using `jackc/pgx/v5` in `backend/cmd/migrate/main.go`

---

## Phase 2: Foundational (Blocking)

- [x] T005 [P] Implement PostgreSQL schema for `companies`, `news_categories`, `news_articles`, and `news_intelligence` in `backend/migrations/002_relational_schema.sql`
- [x] T006 [P] Seed initial news categories (Macro, Geopolitical, Tech, etc.) in `backend/migrations/003_seed_categories.sql`
- [x] T007 [P] Create shared Go models for relational entities in `backend/internal/models/`
- [x] T008 [P] Create shared Python Pydantic models for news and intelligence in `ai-worker/src/shared/models.py`

---

## Phase 3: User Story 1 - News Intelligence & Trust Scoring [US1]

**Goal**: Deliver real-time news with AI-generated trust and sentiment scores.  
**Test Criteria**: Ingested news flows to `news.raw` -> `AI Worker` -> `news.enriched` -> `Dashboard` with Trust Score visible.

- [x] T009 [P] [US1] Implement `news_producer` in Go to fetch news via Alpha Vantage/NewsAPI in `backend/cmd/producer/news_producer.go`
- [x] T010 [US1] Implement staggered polling logic for news in `backend/internal/services/polling_service.go`
- [x] T011 [P] [US1] Implement `intelligence_worker` in Python to consume `news.raw` in `ai-worker/src/intelligence_worker.py`
- [x] T012 [US1] Integrate OpenAI API for news categorization and trust scoring in `ai-worker/src/services/ai_service.py`
- [x] T013 [P] [US1] Implement persistence worker in Go to sink `news.enriched` to PostgreSQL in `backend/internal/services/news_persistence.go`
- [x] T014 [US1] Update BFF to broadcast `news.enriched` messages via WebSockets in `backend/cmd/bff/main.go`
- [x] T015 [P] [US1] Create Enriched News Feed component in React in `frontend/src/components/NewsFeed.tsx`
- [x] T016 [US1] Implement WebSocket hook for real-time news updates in `frontend/src/hooks/useNewsStream.ts`

---

## Phase 4: User Story 2 - Fundamental Business Intelligence [US2]

**Goal**: Provide financial context for companies mentioned in the news.  
**Test Criteria**: Selecting a ticker in the news feed displays its current P/E, Market Cap, and Revenue Growth in the sidebar.

- [ ] T017 [P] [US2] Implement `fundamentals_producer` in Go to fetch company metrics daily in `backend/cmd/producer/fundamentals_producer.go`
- [ ] T018 [P] [US2] Implement REST endpoint `GET /api/v1/companies/:symbol/fundamentals` in `backend/cmd/bff/main.go`
- [ ] T019 [P] [US2] Create Fundamentals Sidebar component in React in `frontend/src/components/FundamentalsSidebar.tsx`
- [ ] T020 [US2] Implement data fetching hook for company fundamentals in `frontend/src/hooks/useFundamentals.ts`

---

## Phase 5: User Story 3 - Global News Category Heatmap [US3]

**Goal**: Visualize the intensity and sentiment of news across categories.  
**Test Criteria**: Heatmap updates colors/intensity as new articles are categorized by the AI worker.

- [ ] T021 [US3] Implement heatmap data aggregator service in Go in `backend/internal/services/heatmap_service.go`
- [ ] T022 [US3] Add `heatmap.update` broadcast to BFF WebSocket in `backend/cmd/bff/main.go`
- [ ] T023 [P] [US3] Create Category Heatmap visualization component in React in `frontend/src/components/Heatmap.tsx`
- [ ] T024 [US3] Implement category filtering logic in the News Feed based on heatmap interaction in `frontend/src/store/intelligenceStore.ts`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T025 Implement robust error handling and retries for external API calls in `backend/internal/pkg/httpclient/`
- [ ] T026 Add rate limit monitoring and logging for AI and Market Data APIs
- [ ] T027 Final UI/UX polish, ensuring responsiveness and consistent styling with Tailwind CSS
- [ ] T028 Update `README.md` with final MVP documentation and demo instructions

---

## Implementation Strategy

1. **MVP First**: Focus exclusively on US1 to establish the end-to-end real-time pipeline.
2. **Incremental Delivery**: US2 and US3 can be developed in parallel once US1 is functional.
3. **Fail-Fast**: Validate AI scoring accuracy early in Phase 3 before building the full frontend.

## Dependencies

- **US1** depends on **Foundational Phase** (Schema & Models).
- **US2** depends on **Foundational Phase** (Schema).
- **US3** depends on **US1** (Categorized News Data).

## Parallel Execution Examples

- **Data Flow**: T009 (News Producer) and T011 (AI Worker) can be implemented simultaneously.
- **Frontend/Backend**: T015 (News Feed UI) and T014 (BFF WebSocket) can be developed in parallel using the `frontend_ws.json` contract.
