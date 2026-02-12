# Database Improvements

This document tracks potential database schema and optimization improvements for future iterations.

## Schema Improvements

### Status Fields Should Use pgEnum

**Current:** Status fields use `varchar` with string validation
```typescript
status: varchar('status', { length: 20 }).notNull().default('active')
```

**Recommended:** Use `pgEnum` for type safety and constraint enforcement
```typescript
export const collectionStatusEnum = pgEnum('collection_status', [
  'active',
  'sold', 
  'deleted'
])

// In schema:
status: collectionStatusEnum('status').notNull().default('active')
```

**Benefits:**
- Type safety at database level
- Prevents invalid status values
- Better IDE autocomplete
- Self-documenting schema

**Affected Tables:**
- `collections.status` - 'active', 'sold', 'deleted'
- `bids.status` - 'pending', 'accepted', 'rejected', 'cancelled'

**Migration Notes:**
Would require creating enums and migrating existing data. Consider doing this before production launch to avoid complex migrations later.

---

*Last Updated: February 12, 2026*
