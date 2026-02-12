# Bidders Performance Consideration

## Current Approach

The `/collections` page displays bid history using a simple table that renders **all bids** for each collection:

```typescript
// BidHistory.tsx - renders all bids without virtualization
bids.map((bid, index) => (
  <tr key={bid.id}>...</tr>
))
```

## Assumption

We assume collections will have **relatively few bidders** (typically < 50 bids per collection). This allows us to:

- Render all bids at once for simplicity
- Provide immediate visibility of entire bid history
- Avoid virtualization complexity
- Enable smooth animations and transitions

## Performance Threshold

| Bids Count | Performance | UX Quality |
|------------|-------------|------------|
| 1-20 | Excellent | All bids visible |
| 20-50 | Good | Slight scroll needed |
| 50-100 | Acceptable | Noticeable lag |
| 100+ | Poor | Significant performance issues |

## Future Solution: Virtualization

If collections start receiving **50+ bids consistently**, implement list virtualization:

### Recommended Libraries

1. **@tanstack/react-virtual** - Headless, works with our existing table
2. **react-virtuoso** - Higher-level, easier setup for tables

### Implementation Approach

```typescript
// With @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual'

function BidHistoryTable({ bids }) {
  const parentRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: bids.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Row height
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {/* Bid row content */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### UX Trade-offs

With virtualization:
- ✅ Handles 1000+ bids smoothly
- ✅ Maintains 60fps scroll
- ❌ Loses Ctrl+F searchability
- ❌ Requires fixed row heights
- ❌ More complex code

## When to Implement

**Don't implement yet** - only when:
1. Analytics show collections with 50+ bids
2. User complaints about slow bid tables
3. Memory profiling shows excessive DOM nodes

## Monitoring

Track these metrics to know when to virtualize:
- Average bids per collection
- 95th percentile bid count
- Bid table render time (React Profiler)
- DOM node count in expanded rows

## Current File Location

Bid table rendering is in:
- `src/components/collections/BidHistory.tsx` lines 234-369

## Related Documentation

- See `docs/architecture.md` for component architecture patterns
- See `src/components/collections/README.md` for collections search docs
