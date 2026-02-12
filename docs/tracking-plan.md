# Tracking Plan

> **Auto-generated from** `src/lib/utils/tracker.ts`  
> **Last updated:** 2026-02-12

This document defines all analytics events for the Bidding App.

## Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `page_view` | User views a page | `path`: string<br>`referrer`?: string |
| `bid_placed` | User places a bid on a collection | `collection_id`: string<br>`bid_amount_cents`: number<br>`bid_amount_usd`: number |
| `bid_accepted` | Collection owner accepts a bid | `collection_id`: string<br>`bid_id`: string<br>`bid_amount_cents`: number |
| `bid_rejected` | Collection owner rejects a bid | `collection_id`: string<br>`bid_id`: string |
| `collection_created` | User creates a new collection for bidding | `collection_id`: string<br>`starting_price_cents`: number<br>`has_end_date`: boolean |
| `collection_viewed` | User views a collection detail page | `collection_id`: string<br>`source`?: string |
| `user_registered` | New user completes registration | `method`: string<br>`has_referral`: boolean |
| `user_logged_in` | User logs into account | `method`: string |
| `user_logged_out` | User logs out of account | - |
| `search_performed` | User searches for collections | `query`: string<br>`results_count`: number |
| `filter_applied` | User applies filter to collection list | `filter_type`: string<br>`filter_value`: string |
| `cta_clicked` | User clicks a call-to-action button | `cta_id`: string<br>`cta_text`: string<br>`location`: string |
| `signup_started` | User begins signup flow | `source`: string |
| `bid_history_viewed` | User views bid history for a collection | `collection_id`: string |
| `pagination_used` | User navigates to another page of results | `page_number`: number<br>`total_pages`: number<br>`direction`: string |

## Event Details

### `page_view`

**Description:** User views a page

**Properties:**

- `path` (string): Current page path
- `referrer` (string, optional): Previous page referrer

### `bid_placed`

**Description:** User places a bid on a collection

**Properties:**

- `collection_id` (string): UUID of the collection
- `bid_amount_cents` (number): Bid amount in cents
- `bid_amount_usd` (number): Bid amount in dollars

### `bid_accepted`

**Description:** Collection owner accepts a bid

**Properties:**

- `collection_id` (string): UUID of the collection
- `bid_id` (string): UUID of the bid
- `bid_amount_cents` (number): Accepted bid amount in cents

### `bid_rejected`

**Description:** Collection owner rejects a bid

**Properties:**

- `collection_id` (string): UUID of the collection
- `bid_id` (string): UUID of the bid

### `collection_created`

**Description:** User creates a new collection for bidding

**Properties:**

- `collection_id` (string): UUID of the new collection
- `starting_price_cents` (number): Initial asking price
- `has_end_date` (boolean): Whether auction has deadline

### `collection_viewed`

**Description:** User views a collection detail page

**Properties:**

- `collection_id` (string): UUID of the collection
- `source` (string, optional): Where user came from (search, direct, etc)

### `user_registered`

**Description:** New user completes registration

**Properties:**

- `method` (string): Registration method (email, oauth)
- `has_referral` (boolean): Whether user had referral code

### `user_logged_in`

**Description:** User logs into account

**Properties:**

- `method` (string): Login method (email, oauth)

### `user_logged_out`

**Description:** User logs out of account

*No properties*



### `search_performed`

**Description:** User searches for collections

**Properties:**

- `query` (string): Search query text
- `results_count` (number): Number of results returned

### `filter_applied`

**Description:** User applies filter to collection list

**Properties:**

- `filter_type` (string): Type of filter (category, price, status)
- `filter_value` (string): Selected filter value

### `cta_clicked`

**Description:** User clicks a call-to-action button

**Properties:**

- `cta_id` (string): Unique identifier for the CTA
- `cta_text` (string): Display text of the button
- `location` (string): Page/section where CTA appears

### `signup_started`

**Description:** User begins signup flow

**Properties:**

- `source` (string): Where signup was initiated (header, hero, pricing)

### `bid_history_viewed`

**Description:** User views bid history for a collection

**Properties:**

- `collection_id` (string): UUID of the collection

### `pagination_used`

**Description:** User navigates to another page of results

**Properties:**

- `page_number` (number): Target page number
- `total_pages` (number): Total available pages
- `direction` (string): next, prev, or direct


---

## Naming Conventions

We follow the **Object-Action** naming convention:
- `object_action` format
- Lowercase with underscores
- Be specific: use `hero_cta_clicked` not just `cta_clicked`

## Standard Properties

These properties are automatically included by most analytics providers:

| Property | Description |
|----------|-------------|
| `timestamp` | When the event occurred |
| `user_id` | Identified user (if logged in) |
| `session_id` | Current session identifier |
| `page_url` | Current page URL |
| `user_agent` | Browser/device info |

## Implementation

### Track an Event

```typescript
import { track } from '@/lib/utils/tracker'

// Simple event
track('page_view', { path: '/collections' })

// Event with properties
track('bid_placed', {
  collection_id: 'uuid-here',
  bid_amount_cents: 50000,
  bid_amount_usd: 500
})
```

### Use the Hook

```typescript
import { useTracker } from '@/hooks/useTracker'

function BidForm() {
  const { track } = useTracker()
  
  const handleSubmit = () => {
    track('bid_placed', { collection_id: '123', bid_amount_cents: 1000 })
  }
}
```

## Adding New Events

1. Add the event to `TRACKING_EVENTS` in `src/lib/utils/tracker.ts`
2. Run `pnpm generate:tracking-plan` to update this document
3. TypeScript will provide autocomplete for event names and properties

---

*Generated by scripts/generate-tracking-plan.ts*