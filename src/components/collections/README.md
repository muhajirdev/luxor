# Search Implementation

Server-side search for the collections catalog.

## Quick Start

```tsx
import { SearchBar } from './SearchBar'

function MyPage() {
  return <SearchBar />
}
```

## Architecture

```
User types → 300ms debounce → URL updates (?q=camera) → 
Loader re-runs → Server searches DB → Results displayed
```

## Flow

1. **User types** in SearchBar input
2. **useSearchQuery hook** debounces input (300ms)
3. **setSearchQuery** updates CollectionsContext state
4. **onSearch callback** updates URL (`navigate({ search: { q: query } })`)
5. **TanStack loader** detects URL change and re-runs
6. **getCollectionsListServer** queries database with `ILIKE`
7. **Results** displayed in CollectionTable

## Files

| File | Purpose |
|------|---------|
| `SearchBar.tsx` | UI component with debounced input |
| `CollectionsContext.tsx` | Manages search state, bridges UI and URL |
| `CollectionTable.tsx` | Displays search results |
| `src/routes/collections.tsx` | URL validation, loader integration |
| `src/lib/server/collections.server.ts` | Database query with search filter |
| `src/hooks/useSearchQuery.ts` | Reusable debounce logic |
| `src/hooks/useDebounce.ts` | Generic debounce utilities |

## Server-Side Search

The search is performed in the database:

```typescript
// collections.server.ts
const searchCondition = search
  ? or(
      ilike(collections.name, `%${search}%`),
      ilike(collections.description, `%${search}%`)
    )
  : undefined
```

**Fields searched:**
- `collections.name` - Collection title
- `collections.description` - Collection description

**Matching:**
- Case-insensitive (`camera` matches `Camera`)
- Partial match (`cam` matches `camera`)
- OR logic - matches either field

## URL Format

- Search: `/collections?q=camera`
- Search + Page: `/collections?q=camera&page=2`
- Empty: `/collections`

## Customization

### Change Debounce Time

```tsx
// SearchBar.tsx
const DEBOUNCE_MS = 500 // Was 300
```

### Add Search Fields

```typescript
// collections.server.ts
ilike(collections.name, `%${search}%`),
ilike(collections.description, `%${search}%`),
// Add more:
ilike(collections.category, `%${search}%`)
```

### Use Hook Elsewhere

```tsx
import { useSearchQuery } from '@/hooks/useSearchQuery'

function MyComponent() {
  const { inputValue, setInputValue, isSearching } = useSearchQuery({
    debounceMs: 300,
    onSearch: (query) => console.log('Search:', query)
  })
  
  return <input value={inputValue} onChange={e => setInputValue(e.target.value)} />
}
```

## Performance

- **Debounce:** 300ms prevents excessive requests
- **Pagination:** Only 20 results per request
- **Database:** Add trigram index for large datasets
  ```sql
  CREATE INDEX idx_collections_name_trgm 
  ON collections USING GIN (name gin_trgm_ops);
  ```

## Troubleshooting

**Search not working:**
- Check browser console for errors
- Verify server function receives `search` parameter
- Check database query logs

**URL not updating:**
- Verify `navigate()` is called in `onSearch`
- Check `validateSearch` schema in route

**Too many requests:**
- Increase `debounceMs` (try 500)
