# Feature Specification: Custom Watchlists

**Feature Branch**: `002-custom-watchlists`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Add a new feature to the RSIAS Core Engine that allows users to create and manage custom watchlists of tickers. Each watchlist should have a name and a list of tickers. Users should be able to add/remove tickers from their watchlists and view real-time data for the tickers in their active watchlist."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Name Watchlists (Priority: P1)

As a user, I want to create multiple watchlists with unique names so that I can organize my market monitoring by sector, strategy, or interest.

**Why this priority**: Core functionality needed before tickers can be added or managed.

**Independent Test**: Can be fully tested by creating a new watchlist named "Tech Growth" and verifying it appears in the user's list of watchlists.

**Acceptance Scenarios**:

1. **Given** a user is on the dashboard, **When** they click "New Watchlist" and enter "Energy Sector", **Then** a new empty watchlist named "Energy Sector" is created and displayed.
2. **Given** a user has an existing watchlist, **When** they attempt to create another with the same name, **Then** the system provides a clear error message that the name must be unique.

---

### User Story 2 - Ticker Management (Priority: P1)

As a user, I want to add and remove stock tickers from my watchlists so that I can customize the specific assets I am tracking.

**Why this priority**: Essential for making watchlists useful; allows users to curate their monitoring experience.

**Independent Test**: Can be tested by adding "AAPL" to a watchlist, verifying it is listed, then removing it and verifying it is no longer listed.

**Acceptance Scenarios**:

1. **Given** an empty watchlist, **When** a user searches for and selects "NVDA", **Then** "NVDA" is added to the watchlist.
2. **Given** a watchlist containing "TSLA", **When** a user clicks the "Remove" icon next to "TSLA", **Then** "TSLA" is immediately removed from the view.

---

### User Story 3 - Active Watchlist Real-time Monitoring (Priority: P2)

As a user, I want to set one of my watchlists as "Active" to view real-time price updates and intelligence scores for all tickers in that list simultaneously.

**Why this priority**: High value for active monitoring; connects the watchlist to the core real-time engine.

**Independent Test**: Can be tested by selecting a watchlist with 3 tickers and verifying that the live data feed updates for all 3 tickers within the dashboard view.

**Acceptance Scenarios**:

1. **Given** multiple watchlists, **When** a user selects "High Volatility" as active, **Then** the main dashboard feed switches to display live data for only those tickers.
2. **Given** an active watchlist, **When** a ticker in that list receives new intelligence, **Then** the dashboard highlights the update for that specific ticker in real-time.

---

### Edge Cases

- **Empty Watchlist**: What happens when a user sets an empty watchlist as active? (System should show a placeholder message "Add tickers to see data").
- **Deleted Tickers**: How does the system handle a ticker being removed from a watchlist while it is active? (The ticker should be removed from the real-time feed immediately).
- **Service Interruption**: How does the system handle real-time feed disconnects while viewing an active watchlist? (System shows a "Reconnecting" status and preserves the list of tickers).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create up to 10 unique watchlists.
- **FR-002**: Each watchlist MUST have a user-defined name (max 50 characters).
- **FR-003**: System MUST allow adding up to 20 tickers per watchlist.
- **FR-004**: System MUST persist watchlists and their tickers across user sessions.
- **FR-005**: System MUST allow users to delete an entire watchlist.
- **FR-006**: System MUST support selecting one watchlist at a time as the "Active" monitoring source.
- **FR-007**: When a watchlist is active, the dashboard MUST show real-time price and intelligence updates for all constituent tickers.

### Key Entities *(include if feature involves data)*

- **Watchlist**: Represents a collection of tickers. Attributes: ID, Name, UserID, CreatedDate.
- **WatchlistTicker**: Represents the relationship between a watchlist and a ticker. Attributes: WatchlistID, TickerSymbol.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new watchlist in under 5 seconds.
- **SC-002**: Adding or removing a ticker from a watchlist is reflected in the UI in under 200ms.
- **SC-003**: Switching between active watchlists updates the real-time feed in under 1 second.
- **SC-004**: 100% of watchlist data (names and tickers) is persisted and correctly reloaded upon session restart.

## Assumptions

- **User Context**: A user is already authenticated and has an established `UserID`.
- **Ticker Validity**: The system assumes tickers added are valid and tracked by the RSIAS Core Engine.
- **Real-time Availability**: Real-time data is available for all tickers in the watchlist via the existing market data services.
