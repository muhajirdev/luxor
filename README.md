# Luxor Bids

A premium full-stack bidding marketplace where serious collectors bid with confidence. Built with TanStack Start, PostgreSQL, and Tailwind CSS.

## Documentation

All project decisions, standards, and context are documented:

- **[Project State](./docs/project-state.md)** - Current progress, roadmap, and architecture decisions
- **[Brand Voice](./docs/brand-voice.md)** - Verbal identity, tone, and messaging guidelines
- **[Design Guidelines](./docs/design-guidelines.md)** - Visual design standards (AI-optimized for quick MVP)
- **[Product Marketing Context](./docs/product-marketing-context.md)** - Positioning, target audience, and value proposition
- **[User Flows](./docs/user-flows.md)** - User journey documentation and interaction flows
- **[API Documentation](./docs/api.md)** - API endpoint reference
- **[Analytics Tracking](./docs/analytics-tracking.md)** - Type-safe analytics implementation and tracking plan
- **[TODO List](./TODO.md)** - Development tasks and priorities

## Features

- **Collection Management** - Create, edit, and manage collectible item listings
- **Bidding System** - Place, update, and cancel bids on collections
- **Accept Bid Workflow** - Collection owners can accept bids (auto-rejects all others)
- **Nested Table UI** - Expandable collections showing all associated bids
- **Role-Based Controls** - Different permissions for collection owners vs bidders
- **Dark Premium Design** - Blur.io-inspired aesthetic with amber accents
- **Type-Safe Analytics** - 100% TypeScript-autocomplete for event tracking with auto-generated docs

## Key Decisions

### Component Architecture Pattern
We use **State Colocation + ID-based Selection + Composition** for complex UI components:

- **Flexibility**: Composition lets you rearrange, style, or swap pieces independently  
- **No Prop Drilling**: State colocation + context gets data where it's needed
- **Performance**: Primitive props work with default `React.memo`—no custom comparison needed

See `docs/architecture.md` and ["Composition Is All You Need" by Fernando Rojo](https://www.youtube.com/watch?v=4KvbVq3Eg5w).

### Design System (MVP)
Using [Design Guidelines](./docs/design-guidelines.md) optimized for rapid AI-assisted development. A full design system will be built post-MVP.

### Type-Safe Architecture
**No REST APIs.** Using TanStack Start server functions for 100% end-to-end type safety from database to UI.

### Type-Safe Event Tracking
Analytics events are defined as a TypeScript constant with type-inferred properties. TypeScript provides autocomplete for event names and validates property types at compile time. Documentation is auto-generated from the code, ensuring it never goes out of sync.

### Database
PostgreSQL (Neon) with explicit query builders via Drizzle ORM for type-safe data access.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with file-based routing
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Neon) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Custom email/password with HTTP-only cookies
- **Forms**: TanStack Form + Zod validation
- **UI Components**: shadcn/ui
- **Testing**: Vitest + React Testing Library
- **Deployment**: Cloudflare Workers

## Development Tools

### React Scan (Performance Debugging)

[React Scan](https://github.com/aidenybai/react-scan) is included in the project for performance debugging. It visualizes component re-renders to help identify performance issues.

**Features:**
- Highlights components that re-render with color-coded borders
- Shows render frequency and timing
- Helps catch unnecessary re-renders

**How to enable:**

1. Open `src/routes/__root.tsx`
2. Uncomment the React Scan script tag in the `<head>` section:

```tsx
<script
  crossOrigin="anonymous"
  src="//unpkg.com/react-scan/dist/auto.global.js"
/>
```

3. Refresh the page and watch for colored borders around re-rendering components

**Note:** Only use React Scan in development. Never enable it in production.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bidding-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@hostname/dbname?sslmode=require"

# Auth
SESSION_SECRET="your-super-secret-session-key-min-32-chars"
```

4. Set up the database:
```bash
# Generate migrations
pnpm drizzle-kit generate

# Run migrations (manually in production)
pnpm drizzle-kit migrate

# Seed with sample data
pnpm tsx src/lib/db/seed.ts
```

5. Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Test Accounts

After seeding the database, you can log in with any of these test accounts:

**All accounts use password:** `password123`

| Email | Name | Role |
|-------|------|------|
| `admin@luxorbids.com` | Admin User | Administrator |
| `sarah.mitchell@email.com` | Sarah Mitchell | Collector |
| `james.chen@email.com` | James Chen | Collector |
| `maria.rodriguez@email.com` | Maria Rodriguez | Collector |
| `robert.williams@email.com` | Robert Williams | Collector |
| `elizabeth.taylor@email.com` | Elizabeth Taylor | Collector |
| `david.kim@email.com` | David Kim | Collector |
| `emily.johnson@email.com` | Emily Johnson | Collector |
| `michael.brown@email.com` | Michael Brown | Collector |
| `jennifer.davis@email.com` | Jennifer Davis | Collector |

The seed data includes 15 users with 120+ collections and realistic bid history.

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server on port 3000
pnpm build            # Production build
pnpm serve            # Preview production build locally

# Testing
pnpm test             # Run all tests
pnpm test -- --grep "pattern"  # Run specific tests

# Database
pnpm drizzle-kit generate    # Generate migration files
pnpm drizzle-kit migrate     # Run migrations (manual only)
pnpm tsx src/lib/db/seed.ts  # Seed database with sample data

# Deployment
pnpm deploy           # Build and deploy to Cloudflare Workers
pnpm preview          # Build and preview locally

# Project Management
pnpm improvements     # List all future improvements ranked by priority

# Analytics
pnpm generate:tracking-plan  # Generate tracking-plan.md from tracker.ts
```

## API Documentation

See [docs/api.md](./docs/api.md) for endpoint documentation.

## Database Schema

See [src/lib/db/schema.ts](./src/lib/db/schema.ts) for full schema definitions.

## Architecture Decisions

### Why TanStack Start?
- Workspace already configured for TanStack Start
- RPC-style server functions eliminate REST boilerplate
- File-based routing is intuitive
- Demonstrates modern React framework knowledge

### Why PostgreSQL (Neon)?
- Production-grade database with serverless scaling
- Better concurrent write handling than SQLite
- Fits well with Cloudflare Workers deployment

### Why Custom Authentication?
Simple for MVP — we can migrate to managed auth (Clerk/Auth0) later if needed.

### Why TanStack Form?
- Native TanStack ecosystem integration
- Fine-grained reactivity for better performance
- Type-safe by default
- Headless design works with shadcn/ui

## Future Improvements

See [docs/future-improvements/](./docs/future-improvements/) for planned enhancements.

## Testing

Run the test suite:

```bash
pnpm test
```

Tests are located alongside components using the `.test.tsx` pattern.

## Deployment

### Cloudflare Workers

1. Configure `wrangler.jsonc` with your account details
2. Run the deploy command:
```bash
pnpm deploy
```

### Environment Variables for Production

Ensure these are set in your deployment environment:

- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session encryption

## Contributing

1. Follow the existing code style (no semicolons, single quotes, trailing commas)
2. Use `@/` imports for internal modules
3. Use explicit Drizzle query builders (not `db.query`)
4. Add tests for new features
5. Run `pnpm test` and `pnpm build` before committing

## License

[MIT License](./LICENSE)

---

## Production Readiness Questions

> **Q: How would you monitor the application to ensure it is running smoothly?**

### Error Tracking & Performance
- **[Sentry](./docs/future-improvements/monitoring/sentry.md)** - Real-time error tracking with stack traces and user context
- **[Axiom](./docs/future-improvements/monitoring/axiom.md)** - Structured logging for querying and alerting
- **[PostHog](./docs/future-improvements/monitoring/posthog.md)** - Product analytics and user session replays

### Uptime & Alerting
- **[Uptime Monitoring](./docs/future-improvements/monitoring/uptime.md)** - Health checks and downtime alerts
- **[Discord Alerts](./docs/future-improvements/monitoring/discord-alerts.md)** - Real-time notifications for critical issues

### Type-Safe Analytics
- **[Analytics Tracking](./docs/analytics-tracking.md)** - 100% TypeScript-autocomplete for event tracking
- **[Tracking Plan](./docs/tracking-plan.md)** - Auto-generated from code (never out of sync)

### Database Monitoring
- Neon dashboard for query performance
- Connection pool monitoring
- Slow query identification via indexes

> **Q: How would you address scalability and performance?**

### Horizontal Scaling
**Cloudflare Workers** auto-scale globally across 300+ edge locations:
- No server management required
- Pay-per-request pricing
- Automatic load balancing
- Zero cold starts

### Database Optimization
- **[Cloudflare Hyperdrive](./docs/future-improvements/performance/cloudflare-hyperdrive.md)** - Connection pooling and intelligent query caching (reduces latency to < 50ms)
- **Indexed Columns** - Owner, status, slug, and created_at columns indexed for fast queries
- **Neon Serverless** - Auto-scaling PostgreSQL with branching for staging

### Caching Strategy
- **[Workers KV](./docs/future-improvements/performance/caching-strategy.md)** - Edge-cached sessions, rate limits, and leaderboard data
- **[Cloudflare CDN](./docs/future-improvements/performance/caching-strategy.md)** - Static assets, images, and API responses cached at 300+ locations globally
- **React Query** - Client-side cache with stale-while-revalidate strategy

### Performance Optimizations
- Component-level memoization (ID-based selection pattern)
- Debounced search to reduce server load
- Pagination for large collection lists
- Image optimization via CDN

> **Q: Trade-offs you had to choose when doing this challenge (the things you would do different with more time and resources)**

Decisions made for rapid MVP delivery and what we'd do differently with more resources:

### 1. Custom Authentication vs Managed Auth
**Current:** Custom email/password with HTTP-only cookies
- ✅ Fast to implement, no vendor lock-in, full control
- ❌ Missing password reset, OAuth, rate limiting, account lockout

**Future:** Migrate to [enhanced auth](./docs/future-improvements/features/enhanced-authentication.md) or Clerk/Auth0
- Forgot password flow, Google OAuth, email verification
- Rate limiting, device fingerprinting, audit logging
- Multi-factor authentication for high-value transactions

### 2. Polling vs Real-Time Updates
**Current:** Client-side polling for bid updates (TanStack Query refetch)
- ✅ Simple infrastructure, works everywhere, no connection management
- ❌ Delayed updates, unnecessary network traffic, poor UX during active bidding

**Future:** [WebSocket or SSE integration](./docs/future-improvements/features/real-time-updates.md)
- PartyKit (Cloudflare edge) or Socket.io for live bid updates
- Instant outbid notifications
- Real-time collection status changes

### 3. External Image URLs vs Upload System
**Current:** Collection images via external URLs (Unsplash)
- ✅ No storage costs or complexity, instant setup
- ❌ Poor UX (users can't upload), dependency on external services, no image optimization

**Future:** [R2 Image Upload](./docs/future-improvements/features/image-upload.md)
- Direct uploads with validation and resizing
- CDN delivery with automatic optimization
- Support for multiple images per collection

### 4. Testing Coverage
**Current:** Limited test coverage focused on critical paths
- ✅ Faster iteration during MVP phase
- ❌ Risk of regressions, slower confident refactors

**Future:** Comprehensive test suite
- Unit tests for all server functions
- Integration tests for bidding workflows
- E2E tests for critical user journeys

### 5. Payment Integration
**Current:** No payment processing (bidding only)
- ✅ Simplified MVP, no PCI compliance complexity
- ❌ No way to collect deposits or finalize transactions

**Future:** [Stripe Integration](./docs/future-improvements/features/payment-integration.md)
- Bid deposits to prevent spam
- Automatic payment capture on bid acceptance
- Escrow system for high-value items

### 6. Search & Discovery
**Current:** Basic text search on name/description
- ✅ Simple implementation, fast enough for MVP scale
- ❌ No faceted search, no recommendations, limited discovery

**Future:** [Advanced Search](./docs/future-improvements/features/search-discovery.md)
- Full-text search with Algolia/Typesense
- Category-based filtering and sorting
- Recommendation engine based on bidding history

See [docs/future-improvements/](./docs/future-improvements/) for complete roadmap and implementation details.
