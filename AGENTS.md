# Agent Guidelines for Bidding App

## Commands

```bash
# Development
pnpm dev              # Start dev server on port 3000
# IMPORTANT: Do NOT start the dev server automatically. The user will start it manually.
pnpm build            # Production build
pnpm serve            # Preview production build

# Testing
pnpm test             # Run all tests
pnpm test -- src/components/Button.test.tsx    # Single test file
pnpm test -- --grep "should render"             # Test by pattern

# Database
pnpm drizzle-kit generate    # Generate migration ONLY - NEVER RUN PUSH
# pnpm drizzle-kit migrate   # DON'T RUN - human will migrate manually
pnpm tsx src/lib/db/seed.ts  # Seed database

# Deployment
pnpm deploy           # Build and deploy to Cloudflare Workers
pnpm preview          # Build and preview locally
```

## Tech Stack

- **Framework**: TanStack Start (file-based routing)
- **Build**: Vite with Cloudflare Workers
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Forms**: TanStack Form + Zod
- **UI**: shadcn/ui components
- **Testing**: Vitest + React Testing Library

## Critical Rules

### Database Migrations
**NEVER run `drizzle-kit push` or `drizzle-kit migrate`.**  
Only use `drizzle-kit generate` to create migration files.  
The human will run migrations manually. Violating this can corrupt production data.

### Backend Architecture
**Do NOT create REST API routes.**  
Use TanStack Start server functions (`createServerFn`) for all backend logic.  
Server functions are RPC-style and colocated with routes or in separate `.server.ts` files.

### Database Queries
**NEVER use `db.query` syntax.**  
Always use explicit query builders:
- `db.select()` for reads
- `db.insert()` for creates  
- `db.update()` for updates
- `db.delete()` for deletes

This ensures type safety and explicit control over queries.

## Code Style

### Imports
```typescript
// 1. External packages (alphabetical)
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

// 2. Internal absolute imports (@/)
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'

// 3. Relative imports (only when necessary)
import { helper } from './utils'
```

### Naming Conventions
- **Components**: PascalCase (`CollectionCard.tsx`)
- **Hooks**: camelCase starting with `use` (`useAuth.ts`)
- **Utils**: camelCase (`formatPrice.ts`)
- **Server functions**: camelCase ending with `Server` (`getCollectionServer.ts`)
- **Constants**: SCREAMING_SNAKE_CASE

### Types
```typescript
// Use TypeScript strict mode - always type function returns
function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// Use Drizzle's inferred types
import type { Collection, NewCollection } from '@/lib/db/schema'

// Prefer interfaces for object shapes
interface Props {
  collection: Collection
  onBid: (amount: number) => void
}
```

### Error Handling
```typescript
// Use Zod for validation
const schema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0')
})

// Server functions should return Result types
import { createServerFn } from '@tanstack/react-start'

export const placeBidServer = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    try {
      // ... logic
      return { success: true, bid }
    } catch (error) {
      // Log to Sentry in production
      return { success: false, error: error.message }
    }
  })

// Components handle errors gracefully
const [error, setError] = useState<string | null>(null)
```

### Component Structure
```typescript
// Route components use createFileRoute
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/collections/$id')({
  component: CollectionDetail,
  loader: async ({ params }) => {
    // Load data here
  }
})

function CollectionDetail() {
  const { id } = Route.useParams()
  const data = Route.useLoaderData()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Component JSX */}
    </div>
  )
}
```

### Styling (Tailwind)
```typescript
// Use semantic color tokens
<div className="bg-background text-foreground">

// Group related classes
<button className="
  inline-flex items-center justify-center
  px-4 py-2 rounded-md
  bg-primary text-primary-foreground
  hover:bg-primary/90
  disabled:opacity-50 disabled:cursor-not-allowed
">

// Extract repeated patterns to component or cn() utility
import { cn } from '@/lib/utils'
```

### Database Queries
```typescript
// Use explicit query builders - NEVER use db.query
import { eq, desc } from 'drizzle-orm'

// Read with joins
const collections = await db
  .select({
    collection: collections,
    owner: users
  })
  .from(collections)
  .leftJoin(users, eq(collections.ownerId, users.id))
  .where(eq(collections.status, 'active'))

// Create
await db.insert(collections).values({
  name: 'Vintage Camera',
  price: 50000,
  ownerId: userId
})

// Update
await db
  .update(collections)
  .set({ status: 'sold' })
  .where(eq(collections.id, collectionId))

// Delete
await db
  .delete(bids)
  .where(eq(bids.id, bidId))

// Always handle nullable relations
const ownerName = collection.owner?.name ?? 'Unknown'
```

## Project Structure

```
src/
├── routes/              # File-based TanStack routes
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   └── app/            # Protected routes
├── components/         # Reusable components
│   ├── ui/            # shadcn components
│   └── *.tsx          # Feature components
├── lib/               # Utilities
│   ├── db/           # Database schema & client
│   ├── auth/         # Auth utilities
│   └── utils.ts      # cn() and helpers
├── hooks/            # Custom React hooks
└── styles/           # Global styles
```

## Key Decisions

- **No semicolons** (enforced by TS strict mode warnings)
- **Single quotes** for strings
- **Trailing commas** (always)
- **2-space indentation**
- **Max 100 chars** per line
- **Prefer `function` over arrow functions** for named exports
- **Use `const`/`let`**, never `var`

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CollectionCard } from './CollectionCard'

describe('CollectionCard', () => {
  it('should render collection name', () => {
    render(<CollectionCard collection={mockCollection} />)
    expect(screen.getByText('Vintage Camera')).toBeInTheDocument()
  })
})
```

## Before Committing

1. Run `pnpm test` - all tests must pass
2. Run `pnpm build` - build must succeed
3. Check TypeScript errors: no `any` types, strict mode violations
4. Verify imports use `@/` prefix for src files
5. Ensure no `console.log` in production code (use `console.error` for errors)

## Component Architecture Pattern

For complex UI components (tables, lists with filtering), use the **State Colocation + ID-based Selection + Composition**:

### Key Principles

**1. State Colocation**
Keep state closest to where it's used. Only use context for truly global/shared state.

```typescript
// ✅ Good - Local state in component that needs it
function CollectionTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null) // Local
  const { filteredCollections } = useCollections() // Only global state
  // ...
}
```

**2. Pass IDs, Select Data (ID-based Selection)**
Pass primitive IDs and let components select their own data:

```typescript
// ✅ Good - pass ID + primitives, no custom comparison needed
<CollectionRow 
  collectionId={collection.id}  // string
  isExpanded={expandedId === collection.id}  // boolean
  onToggle={handleToggle}  // stable callback
/>

const CollectionRow = memo(function CollectionRow({ collectionId, isExpanded }) {
  const collection = useCollection(collectionId) // Select by ID
  return <tr>...</tr>
})
// React.memo default comparison works - no custom function needed!
```

**3. Composition (Radix UI Pattern)**
Break into small, composable primitives:

```typescript
<CollectionTableRoot>
  <TableHeader>
    <TableHead>Name</TableHead>
  </TableHeader>
  <TableBody>
    {collections.map(c => <CollectionRow key={c.id} collectionId={c.id} />)}
  </TableBody>
</CollectionTableRoot>
```

### Benefits

1. **Flexibility** - Composition lets you rearrange, style, or swap pieces without touching internals
2. **No Prop Drilling** - State colocation + context gets data where it's needed
3. **Performance** - Primitive props work with default `React.memo`—no custom comparison needed

### When to Use

**Use for:**
- Complex tables with expandable rows
- Lists with 50+ items
- Components with deeply nested children

**Skip for:**
- Simple forms or static content
- Small lists (< 20 items)

### Avoid Custom Comparison Functions

By passing IDs instead of objects, React's default shallow comparison works:
- `collectionId`: string (primitive) ✓
- `isExpanded`: boolean (primitive) ✓
- `onToggle`: function (stabilized with useCallback) ✓

Only use custom comparison if profiling shows it's needed.

See `docs/architecture.md` for detailed explanation.

**Reference:** ["Composition Is All You Need" - Fernando Rojo at React Universe Conf 2025](https://www.youtube.com/watch?v=4KvbVq3Eg5w)

## Resources

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Project State](../docs/project-state.md)
- [TODO List](../TODO.md)
