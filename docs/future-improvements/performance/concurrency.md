# Concurrency Handling

**Priority:** High (for multi-unit inventory)
**Status:** MVP uses transactions, future needs optimization

## Problem

When multiple bids are accepted simultaneously for the same collection:

```
Stock: 1 remaining
User A clicks accept → reads stock=1 ✓
User B clicks accept → reads stock=1 ✓ (stale!)
Both succeed → stock=-1 ❌
```

## MVP Solution (Database Transactions)

```typescript
await db.transaction(async (tx) => {
  const collection = await tx
    .select({ stock: collections.stock })
    .from(collections)
    .where(eq(collections.id, id))
    .for('update')  // Row-level lock
    
  if (collection.stock <= 0) throw new Error('Sold out')
  
  await tx.update(collections)
    .set({ stock: collection.stock - 1 })
})
```

## Production Solutions

### 1. Optimistic Locking

```typescript
// Add version column to collections
collections {
  ...
  version: integer default 1
}

// Update with version check
await db.update(collections)
  .set({ stock: newStock, version: currentVersion + 1 })
  .where(and(
    eq(collections.id, id),
    eq(collections.version, currentVersion)
  ))

// If no rows updated → conflict, retry
```

### 2. Redis Queue System

```typescript
// Serialize bid processing through Redis queue
await redis.lpush('bid_queue', { collectionId, bidId, userId })

// Worker processes one at a time
while (true) {
  const job = await redis.brpop('bid_queue')
  await processBidAcceptance(job)
}
```

### 3. Event Sourcing

```typescript
// Instead of updating stock, append events
events {
  type: 'bid_accepted',
  collection_id,
  bid_id,
  timestamp
}

// Calculate current stock from event log
const stock = initialStock - acceptedBidsCount
```

### 4. Rate Limiting

```typescript
// Prevent rapid-fire acceptance attempts
await rateLimiter.consume(`accept_bid:${collectionId}`, 1)
// Max 1 acceptance per second per collection
```

## Recommendation for Scale

- **< 100 concurrent users:** Database transactions (current)
- **100-1000 users:** Optimistic locking
- **1000+ users:** Queue system (Redis/Bull)
