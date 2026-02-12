# Future Improvements

*This document tracks planned enhancements and architectural decisions for future iterations.*

---

## Architecture

### Monorepo Migration
**Status:** Planned for post-MVP

**Rationale:**
As the application grows, a monorepo structure will provide better code organization, shared packages, and team scalability.

**Proposed Structure:**
```
luxor-bids/
├── apps/
│   ├── web/                    # Current TanStack Start app
│   ├── mobile/                 # Future React Native app
│   └── admin/                  # Future admin dashboard
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── database/               # Drizzle schema & migrations
│   ├── auth/                   # Shared auth utilities
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # Shared config (eslint, tsconfig, etc.)
├── docs/                       # Documentation
└── tooling/                    # Scripts and automation
```

**Tools to Consider:**
- **Turborepo** — Fast builds, excellent caching, great DX
- **Nx** — More features, better for large teams
- **pnpm workspaces** — Native monorepo support

**Migration Strategy:**
1. Set up pnpm workspaces in root
2. Move shared code to `packages/` 
3. Extract database layer to `packages/database`
4. Extract auth utilities to `packages/auth`
5. Gradually migrate app code to `apps/web`

**Benefits:**
- ✅ Code sharing between apps (same auth, same types)
- ✅ Atomic deployments (all apps deploy together)
- ✅ Unified versioning and changelog
- ✅ Easier testing across packages
- ✅ Better dependency management

**When to Implement:**
- After MVP is complete and stable
- When starting a second app (mobile or admin)
- When team size grows beyond 2-3 developers

---

## Features

### Enhanced Authentication
**Priority:** High
**Status:** Not Started

**Forgot Password Flow:**
- Password reset via email
- Secure token-based reset links
- Time-limited reset tokens (1 hour expiry)
- Rate limiting on reset requests

**Google OAuth Integration:**
- One-click sign in with Google
- Automatic account linking
- Profile photo sync
- Secure OAuth 2.0 flow

**Implementation Notes:**
- Store reset tokens in separate table with expiry
- Use Resend or SendGrid for transactional emails
- OAuth requires Google Cloud Console setup
- Update users table to support OAuth provider IDs

**New Tables:**
```typescript
password_resets {
  id: uuid (PK)
  user_id: uuid (FK → users.id)
  token_hash: varchar(255)  -- bcrypt hashed token
  expires_at: timestamp
  used: boolean default false
  created_at: timestamp
}

oauth_accounts {
  id: uuid (PK)
  user_id: uuid (FK → users.id)
  provider: varchar(50)  -- 'google', 'github', etc.
  provider_account_id: varchar(255)
  access_token: text
  refresh_token: text
  expires_at: timestamp
  created_at: timestamp
}
```

---

### Real-Time Updates
**Priority:** High
**Status:** Not Started

Replace polling with WebSocket or Server-Sent Events for:
- Live bid updates
- Collection status changes
- Outbid notifications

**Tech Options:**
- Socket.io
- PartyKit (Cloudflare edge)
- Ably/Pusher (managed)

---

### Notifications
**Priority:** Medium
**Status:** Not Started

**Email Notifications:**
- Outbid alerts
- Bid accepted/rejected
- Collection ending soon
- New bids on your collections

**Push Notifications:**
- Mobile app integration
- Browser push (web)

**Services:**
- Resend (email)
- Knock (multi-channel)
- Novu (open source)

---

### Payment Integration
**Priority:** High
**Status:** Not Started

Escrow and payment processing:
- Stripe Connect (marketplace payments)
- Hold funds until delivery confirmed
- Automatic payout to sellers

**Flow:**
1. Bid accepted
2. Buyer pays (funds held in escrow)
3. Seller ships item
4. Buyer confirms receipt
5. Funds released to seller (minus 3% fee)

---

### Search & Discovery
**Priority:** Medium
**Status:** Not Started

**Full-Text Search:**
- Algolia (managed, fast)
- Meilisearch (self-hosted)
- PostgreSQL full-text search (simplest)

**PostgreSQL pg_trgm (Trigram) Search:**
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

**Benefits:**
- Handles typos and spelling variations
- No external service needed
- Fast with proper indexing
- Good for medium-sized catalogs (100K+ items)

**Implementation:**
- Add trigram index to collections.name
- Create search API with ranking algorithm
- Debounce search input in UI
- Show "Did you mean?" suggestions

**Filters:**
- Category
- Price range
- Status (active, ending soon, sold)
- Seller rating

---

### Image Upload & CDN
**Priority:** Medium
**Status:** Not Started

Collection and item images:
- Cloudflare R2 (storage)
- Cloudflare Images (optimization)
- Uploadthing (simple integration)

**Features:**
- Drag-and-drop upload
- Image optimization
- Thumbnail generation

---

### Mobile App
**Priority:** Low
**Status:** Not Started

React Native app with:
- Push notifications
- Camera for item authentication
- Biometric auth (Face ID/Touch ID)

**Framework:**
- Expo (faster development)
- React Native CLI (more control)

---

### Payment Verification
**Priority:** Medium
**Status:** Not Started

Pre-bid verification to ensure serious bidders:
- Payment method on file (Stripe customer)
- Available balance verification
- Hold funds when placing bid (escrow)
- Prevents bid trolls and non-paying winners

**Schema additions:**
```typescript
users {
  payment_verified: boolean default false
  stripe_customer_id: string
  available_balance: bigint  // cents held in escrow
}
```

**Implementation:**
- Verify payment method before allowing bids
- Place hold on card when bid is placed
- Capture funds when bid is accepted
- Release hold when bid is rejected/cancelled

---

### Ownership History / Provenance Tracking
**Priority:** Medium
**Status:** Not Started

Full chain of custody for high-value collectibles:
- Track every sale and transfer
- Build item provenance and value history
- Fraud detection (stolen items)
- Authenticity verification over time

**New table:**
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

**Features:**
- View full ownership chain on collection detail page
- "Owned by X since [date]" badge
- Price appreciation chart over time
- Export provenance certificate (PDF)

---

## Concurrency & Race Conditions

### Bid Acceptance Race Condition
**Priority:** High (for multi-unit inventory)
**Status:** MVP uses transactions, future needs optimization

**Problem:**
When multiple bids are accepted simultaneously for the same collection:
```
Stock: 1 remaining
User A clicks accept → reads stock=1 ✓
User B clicks accept → reads stock=1 ✓ (stale!)
Both succeed → stock=-1 ❌
```

**MVP Solution (Database Transactions):**
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

**Production Solutions:**

**1. Optimistic Locking**
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
    eq(collections.version, currentVersion)  // Only if unchanged
  ))

// If no rows updated → conflict, retry
```

**2. Redis Queue System**
```typescript
// Serialize bid processing through Redis queue
await redis.lpush('bid_queue', { collectionId, bidId, userId })

// Worker processes one at a time
while (true) {
  const job = await redis.brpop('bid_queue')
  await processBidAcceptance(job)  // Serialized execution
}
```

**3. Event Sourcing**
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

**4. Rate Limiting**
```typescript
// Prevent rapid-fire acceptance attempts
await rateLimiter.consume(`accept_bid:${collectionId}`, 1)
// Max 1 acceptance per second per collection
```

**Recommendation for Scale:**
- **< 100 concurrent users:** Database transactions (current)
- **100-1000 users:** Optimistic locking
- **1000+ users:** Queue system (Redis/Bull)

---

## Performance

### Database Optimization
- [ ] Add indexes on frequently queried columns
- [ ] Connection pooling (PgBouncer)
- [ ] Read replicas for heavy queries
- [ ] Materialized views for analytics

### Caching Strategy
- [ ] Redis for session storage
- [ ] Cache collection listings
- [ ] CDN for static assets
- [ ] React Query caching optimization

### Monitoring
- [ ] PostHog funnels and retention analysis
- [ ] Sentry performance monitoring
- [ ] Database query monitoring (Neon insights)
- [ ] Custom metrics dashboard
- [ ] Better Stack / Uptime monitoring
  - Website uptime monitoring
  - API endpoint checks
  - SSL certificate expiration alerts
  - Discord webhook notifications for downtime
- [ ] Alerting system
  - Discord notifications for critical errors
  - PagerDuty/Opsgenie for on-call rotation
  - Alert thresholds (error rate > 5%, response time > 2s, DB connections > 80%)

---

## Security

### Enhanced Auth
- [ ] Two-factor authentication (2FA)
- [ ] OAuth providers (Google, Twitter)
- [ ] Rate limiting on auth endpoints
- [ ] Suspicious activity detection

### Data Protection
- [ ] Row-level security (RLS) in Postgres
- [ ] Data encryption at rest
- [ ] GDPR compliance tools
- [ ] Data retention policies

---

## DevOps

### CI/CD
- [ ] GitHub Actions for testing
- [ ] Preview deployments on PRs
- [ ] Automated database migrations
- [ ] E2E tests with Playwright

### Infrastructure
- [ ] Multi-region deployment
- [ ] Edge caching (Cloudflare)
- [ ] Backup automation
- [ ] Disaster recovery plan
- [ ] Health check endpoint (`/health`)
  - Database connectivity check
  - External service status (Stripe, email provider)
  - Response time monitoring
  - Load balancer health probes

---

## Notes

**Decision Log:**

*2024-02-12:* Decided to start with single-repo for MVP speed. Monorepo will be phase 2 once we validate product-market fit and add mobile app.

*2024-02-12:* Added PostHog and Sentry to tracking stack. Will implement basic tracking in MVP, expand to full funnel analysis post-launch.

*2024-02-12:* Deferred payment verification and ownership history tracking to post-MVP. MVP will assume good-faith bidding and track only current ownership.

*2024-02-12:* Collection names use `text` type instead of varchar(255) for maximum flexibility. Will implement pg_trgm fuzzy search with GIN indexes for production search functionality.

---

*Last Updated: February 12, 2026*
