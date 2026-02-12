# System Architecture

## Overview

Luxor Bids uses a **type-safe full-stack architecture** with TanStack Start, PostgreSQL, and server-side sessions.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client (UI)   │────▶│  Server Functions│────▶│   PostgreSQL    │
│  React + Vite   │     │  (RPC-style)    │     │   (Neon)        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                      │
         │                      │                      │
    TanStack Router      TanStack Start           Drizzle ORM
    TanStack Query       Server Functions         Sessions Table
    HTTP-only Cookies    Zod Validation           Collections
    shadcn/ui            bcrypt                   Bids
```

## Request Lifecycle

### Example: Placing a Bid

```
1. User clicks "Place Bid"
   └─▶ React Component calls server function

2. Server Function (RPC)
   ├─▶ Validate session (HTTP-only cookie → session token)
   ├─▶ Validate input (Zod schema)
   ├─▶ Check permissions (is authenticated?)
   ├─▶ Database transaction
   │   ├─▶ Check collection exists
   │   ├─▶ Check user != owner
   │   ├─▶ Create bid record
   │   └─▶ Update collection stats
   └─▶ Return result

3. Client updates UI
   └─▶ TanStack Query invalidates/refetches
```

## Authentication Flow

**Session-Based Auth** (not JWT):

```
Sign In:
┌──────────┐    ┌─────────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───▶│  Server Fn  │───▶│  bcrypt  │───▶│ Database │
└──────────┘    └─────────────┘    └──────────┘    └──────────┘
     │                │                                    │
     │                │◄───────────────────────────────────│
     │                │         Verify password            │
     │                │                                    │
     │                │    ┌──────────┐                   │
     │                └───▶│ Sessions │◄──────────────────│
     │                     └──────────┘   Create token    │
     │                          │                         │
     │◄─────────────────────────│ Set HTTP-only cookie    │
     │                                                    │

Subsequent Requests:
1. Browser sends cookie (session_token)
2. Server validates token against sessions table
3. Server retrieves user data
4. Request proceeds with user context
```

## Database Layer

**Drizzle ORM** with explicit query builders (no `db.query`):

```typescript
// Good ✓
const collections = await db
  .select()
  .from(collectionsTable)
  .where(eq(collectionsTable.status, 'active'))
  .orderBy(desc(collectionsTable.createdAt))

// Bad ✗ (not used)
const collections = await db.query.collections.findMany()
```

**Schema Core Tables:**
- `users` - Authentication, profiles
- `sessions` - Server-side session storage (7-day expiry)
- `collections` - Items for sale
- `bids` - Bid records

**Relationships:**
- User → Collections (1:N) - Owner relationship
- Collection → Bids (1:N) - Bid history
- User → Bids (1:N) - Bidder relationship

## Server Functions (RPC)

**No REST APIs.** All backend logic via `createServerFn`:

```typescript
// Server function
createServerFn({ method: 'POST' })
  .validator(zBidSchema)
  .handler(async ({ data }) => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Unauthorized')
    
    return await db.transaction(async (tx) => {
      // Atomic database operations
    })
  })
```

**Benefits:**
- 100% end-to-end type safety
- No API route boilerplate
- Automatic serialization
- Better DX (import function, not fetch URL)

## Error Handling

**Server Functions:**
```typescript
// Throw to propagate to client
try {
  await createBid(data)
} catch (error) {
  return { success: false, error: error.message }
}
```

**Client-Side:**
```typescript
const [error, setError] = useState<string | null>(null)

const handleSubmit = async () => {
  const result = await placeBid({ amount })
  if (!result.success) {
    setError(result.error)
    return
  }
  // Success handling
}
```

**Patterns:**
- Server functions return `{ success, data|error }` objects
- Client displays errors gracefully
- Server logs errors for monitoring

## Key Architectural Decisions

### 1. Server-Side Sessions (not JWT)

**Why:**
- Simpler to revoke (just delete from DB)
- No token refresh complexity
- Works seamlessly with SSR

**Trade-off:** Database lookup on every request

### 2. RPC over REST

**Why:**
- Type safety from DB to UI
- Less boilerplate
- Colocated code (server function next to component)

**Trade-off:** Harder for external API consumers (not needed for MVP)

### 3. Single PostgreSQL Database

**Why:**
- ACID transactions for bid acceptance
- Better concurrent write handling
- Fits Cloudflare Workers serverless model



### 4. File-Based Routing

**Why:**
- TanStack Start convention
- No route configuration
- Code splitting by default

## Deployment

**Cloudflare Workers:**
- Edge deployment (fast globally)
- Serverless (pay per request)
- Neon handles connection pooling automatically (PgBouncer or Hyperdrive for other providers)

**Build Process:**
1. Vite builds client bundle
2. Worker script bundled with Wrangler
3. Deployed to Cloudflare edge

## Future Considerations

See `docs/future-improvements/` for:
- Hyperdrive for database connection pooling
- Monorepo structure
- Feature-based architecture
