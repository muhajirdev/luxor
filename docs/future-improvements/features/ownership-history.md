# Ownership History

**Priority:** Medium
**Status:** Not Started

## Overview

Full chain of custody (provenance) for high-value collectibles.

## Use Cases

- Track every sale and transfer
- Build item provenance and value history
- Fraud detection (stolen items)
- Authenticity verification over time

## New Table

```typescript
ownership_transfers {
  id: uuid (PK)
  collection_id: uuid (FK → collections.id)
  from_user_id: uuid (FK → users.id)  // previous owner
  to_user_id: uuid (FK → users.id)    // new owner
  sale_price: bigint                  // what it sold for
  bid_id: uuid (FK → bids.id)         // which bid triggered transfer
  transferred_at: timestamp
}
```

## Features

- View full ownership chain on collection detail page
- "Owned by X since [date]" badge
- Price appreciation chart over time
- Export provenance certificate (PDF)

## Benefits

- Increases trust and transparency
- Helps with valuation
- Creates historical record
- Premium feature for high-value items
