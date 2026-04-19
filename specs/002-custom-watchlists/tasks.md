# Tasks: Custom Watchlists

**Input**: Design documents from `/specs/002-custom-watchlists/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included for core service logic and WebSocket filtering to ensure the 80% coverage mandate in the RSIAS Constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create directory structure for watchlist components in `frontend/src/components/watchlist/`
- [ ] T002 [P] Define `Watchlist` and `WatchlistTicker` structs in `backend/internal/models/watchlist.go`
- [ ] T003 [P] Copy `watchlist_service.proto` to `shared/proto/` and generate Go and TypeScript code

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Create database migration for `watchlists` and `watchlist_tickers` tables in `backend/migrations/004_watchlist_schema.sql`
- [ ] T005 Implement gRPC server boilerplate for `WatchlistService` in `backend/internal/grpc/watchlist_server.go`
- [ ] T006 Configure Redis client for active watchlist state persistence in `backend/internal/services/redis_client.go`
- [ ] T007 Setup Kafka consumer group for ticker data in `backend/cmd/bff/main.go` (if not already foundational)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create and Name Watchlists (Priority: P1) 🎯 MVP

**Goal**: Users can create multiple watchlists with unique names and view their list of watchlists.

**Independent Test**: Create a new watchlist named "Energy Sector" and verify it appears in the user's list. Try to create a duplicate and verify the error message.

### Tests for User Story 1

- [ ] T008 [P] [US1] Unit tests for watchlist creation and retrieval in `backend/internal/services/watchlist_service_test.go`

### Implementation for User Story 1

- [ ] T009 [US1] Implement `CreateWatchlist` and `GetUserWatchlists` in `backend/internal/services/watchlist_service.go`
- [ ] T010 [US1] Implement `DeleteWatchlist` in `backend/internal/services/watchlist_service.go`
- [ ] T011 [US1] Register `WatchlistService` handlers in `backend/cmd/persistence/main.go`
- [ ] T012 [P] [US1] Create `watchlistStore` for state management in `frontend/src/store/watchlistStore.ts`
- [ ] T013 [US1] Implement `WatchlistManagement` UI component with creation/list views in `frontend/src/components/watchlist/WatchlistManagement.tsx`
- [ ] T014 [US1] Integrate `WatchlistManagement` into the main dashboard in `frontend/src/App.tsx`

**Checkpoint**: User Story 1 is functional - watchlists can be created and managed independently of tickers.

---

## Phase 4: User Story 2 - Ticker Management (Priority: P1)

**Goal**: Users can add and remove stock tickers from their watchlists.

**Independent Test**: Add "NVDA" to a watchlist, verify it is listed. Remove "TSLA" from a watchlist and verify it is gone.

### Tests for User Story 2

- [ ] T015 [P] [US2] Unit tests for ticker addition/removal and limit validation in `backend/internal/services/watchlist_service_test.go`

### Implementation for User Story 2

- [ ] T016 [US2] Implement `AddTicker` and `RemoveTicker` with validation (max 20) in `backend/internal/services/watchlist_service.go`
- [ ] T017 [US2] Implement ticker search and selection UI in `frontend/src/components/watchlist/TickerSearch.tsx`
- [ ] T018 [US2] Update `WatchlistManagement.tsx` to display and manage ticker lists for the selected watchlist
- [ ] T019 [US2] Add confirmation dialog for watchlist deletion in `frontend/src/components/watchlist/WatchlistManagement.tsx`

**Checkpoint**: User Story 2 is functional - tickers can be curated within watchlists.

---

## Phase 5: User Story 3 - Active Watchlist Real-time Monitoring (Priority: P2)

**Goal**: Set a watchlist as "Active" to view real-time price updates and intelligence scores for its tickers.

**Independent Test**: Select "High Volatility" as active. Verify that only tickers in that list appear in the dashboard feed and update in real-time.

### Tests for User Story 3

- [ ] T020 [P] [US3] Integration test for WebSocket ticker filtering in `backend/tests/integration/watchlist_ws_test.go`

### Implementation for User Story 3

- [ ] T021 [US3] Implement `SET_ACTIVE_WATCHLIST` WebSocket handler in `backend/cmd/bff/main.go`
- [ ] T022 [US3] Implement real-time filtering logic in `backend/cmd/bff/main.go` (Kafka → User Active Ticker Map → WebSocket)
- [ ] T023 [P] [US3] Create `useActiveWatchlistStream` custom hook in `frontend/src/hooks/useActiveWatchlistStream.ts`
- [ ] T024 [US3] Implement `WatchlistFeed` component to display live filtered data in `frontend/src/components/watchlist/WatchlistFeed.tsx`
- [ ] T025 [US3] Add "Set Active" toggle to watchlists in `frontend/src/components/watchlist/WatchlistManagement.tsx`

**Checkpoint**: Full end-to-end functionality reached - watchlists drive the real-time experience.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Add error toast notifications for limit violations and network failures in `frontend/src/components/watchlist/WatchlistManagement.tsx`
- [ ] T027 [P] Implement loading skeletons for watchlist and ticker lists in `frontend/src/components/watchlist/`
- [ ] T028 Performance optimization: Ensure WebSocket broadcasts use efficient marshaling in `backend/cmd/bff/main.go`
- [ ] T029 Security hardening: Verify `user_id` ownership for all watchlist operations in `backend/internal/services/watchlist_service.go`
- [ ] T030 [P] Run and verify all steps in `specs/002-custom-watchlists/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** and **Foundational (Phase 2)** MUST be complete before starting any user story implementation.
- **US1 (Phase 3)** is the prerequisite for **US2 (Phase 4)** because tickers must be added to an existing watchlist.
- **US3 (Phase 5)** depends on **US2** having tickers to monitor, but backend filtering logic can be developed in parallel with US2 UI.

### Parallel Opportunities

- T002 and T003 can be done in parallel (Models vs Proto).
- Once gRPC contracts (T003) and Models (T002) are ready, T004 (Migration) and T005 (gRPC boilerplate) can run in parallel.
- Frontend store (T012) can be developed in parallel with backend services (T009-T011).
- Ticker search UI (T017) can be developed in parallel with backend ticker services (T016).
- WebSocket hook (T023) can be developed in parallel with backend filtering logic (T022).

---

## Parallel Example: User Story 1

```bash
# Backend implementation:
Task: "Implement CreateWatchlist and GetUserWatchlists in backend/internal/services/watchlist_service.go"

# Frontend state management (Parallel):
Task: "Create watchlistStore for state management in frontend/src/store/watchlistStore.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundational phases.
2. Implement US1 (Create/List) and US2 (Add/Remove Tickers).
3. **STOP and VALIDATE**: Verify persistence and limits manually via `quickstart.md`.

### Incremental Delivery

1. Foundation ready.
2. Watchlist Management (US1+US2) ready.
3. Real-time Monitoring (US3) integrated.
4. Final Polish and Hardening.

---

## Notes

- [P] tasks = different files, no direct code dependencies.
- Every gRPC operation MUST validate `user_id` from the context/token.
- WebSocket filtering MUST be efficient to avoid bottlenecking the global Kafka stream.
- shadcn/ui components MUST follow the `DESIGN.md` aesthetics (Saans typography, 4px radius).
