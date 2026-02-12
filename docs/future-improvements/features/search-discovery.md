# Search & Discovery

**Priority:** Medium
**Status:** Not Started

## Full-Text Search Options

- **Algolia** - Managed, fast, expensive at scale
- **Meilisearch** - Self-hosted, good balance
- **PostgreSQL full-text search** - Simplest, no extra infra

## PostgreSQL pg_trgm (Trigram) Search

Fuzzy search implementation similar to Posi learning app:

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN index for fast similarity searches
CREATE INDEX idx_collections_name_trgm 
ON collections USING GIN (name gin_trgm_ops);

-- Query with fuzzy matching
SELECT * FROM collections 
WHERE name % 'vintage camera'  -- % is similarity operator
ORDER BY similarity(name, 'vintage camera') DESC;

-- Combined with ILIKE for partial matches
WHERE name % search_term 
   OR name ILIKE '%' || search_term || '%'
ORDER BY 
  CASE 
    WHEN name = search_term THEN 4
    WHEN name ~ search_term THEN 3
    WHEN name % search_term THEN 1
  END DESC,
  similarity(name, search_term) DESC;
```

## Benefits

- Handles typos and spelling variations
- No external service needed
- Fast with proper indexing
- Good for medium-sized catalogs (100K+ items)

## Implementation

1. Add trigram index to collections.name
2. Create search API with ranking algorithm
3. Debounce search input in UI
4. Show "Did you mean?" suggestions

## Filters

- Category
- Price range
- Status (active, ending soon, sold)
- Seller rating
