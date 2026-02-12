# Project State: Luxor Bids

*Created: February 12, 2026*  
*Last Updated: February 12, 2026*

---

## Project Overview

**Project Type:** Coding Challenge (LuxorLabs Frontend Assessment)  
**Repository:** Local development (will be pushed to GitHub)  
**Deliverable Deadline:** Not specified (assume ASAP)

**Challenge Requirements:**
- Build a full-stack bidding system with Next.js (or similar)
- 100+ collections, 1000+ bids, 10+ users
- CRUD for collections and bids
- Accept bid functionality (auto-rejects others)
- Nested table UI showing collections with bids
- Owner vs Bidder role-based controls
- Forms for create/update operations

---

## Product Goal

### Vision
Transform the coding challenge into **Luxor Bids** — a premium curated marketplace that feels production-ready, not like a toy demo.

### Success Metrics
1. **Functional:** All challenge requirements met (CRUD, accept bid, nested UI)
2. **UX:** Feels like a real product (Blur.io/NFT marketplace aesthetic)
3. **Code Quality:** Clean, well-structured, documented
4. **Marketing:** Real copy, consistent branding, professional presentation

### Core Features (MVP)
| Feature | Priority | Status |
|---------|----------|--------|
| User authentication (email/password) | High | Pending |
| Collection CRUD | High | Pending |
| Bid CRUD + Accept | High | Pending |
| Nested table UI | High | Pending |
| Owner controls (edit/delete/accept) | High | Pending |
| Bidder controls (bid/edit/cancel) | High | Pending |
| Dark premium UI theme | Medium | Pending |
| Real-time bid updates | Low | Pending |
| Email notifications | Low | Pending |

---

## Marketing Strategy

### Brand Positioning
**Luxor Bids** — "Where serious collectors bid with confidence"

**Key Differentiators:**
- 3% fee vs. auction houses' 25-30%
- 7-day sale cycles vs. 6-month auction waits
- Curated listings (no junk, all verified)
- Premium dark aesthetic (Blur.io-inspired)

### Target Personas
1. **Victoria** — Serious collector ($50K+ annual purchases)
   - Values: Authenticity, exclusivity, fair pricing
   - Pain point: Wasting time on fake items
   
2. **Marcus** — Estate curator
   - Values: Speed, fair market value
   - Pain point: Months-long auction timelines
   
3. **James** — NFT collector (new to physical)
   - Values: Easy discovery, transparent pricing
   - Pain point: Physical collectibles feels intimidating

### Copy Guidelines
**Tone:** Professional but approachable, knowledgeable without gatekeeping

**Words to Use:**
- Curated, verified, serious, exclusive, transparent
- Collection, acquisition, curation, floor price, escrow

**Words to Avoid:**
- Cheap, discount, bargain, flip, marketplace (too generic)

### Key Messaging
- "Sell in 7 days, keep 97% of the price"
- "Every item verified, every seller vetted"
- "The NFT experience, now for physical items"

### Visual Identity
- **Colors:** Deep charcoal (#0a0a0a) with amber accents (#f59e0b)
- **Typography:** Bold headlines, monospace for prices/stats
- **Style:** Dark premium, glassmorphism cards, NFT marketplace vibes

---

## Tech Stack

### Core Framework
- **Framework:** TanStack Start
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Router:** TanStack Router (file-based routing)

### Database & ORM
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Connection:** Serverless Postgres via Neon
- **Schema:**
  - `users` — id, email, password_hash, name, created_at
  - `collections` — id, name, description, stocks, price, owner_id, status, created_at
  - `bids` — id, collection_id, price, user_id, status (pending/accepted/rejected), created_at

### Authentication
- **Method:** Custom email/password (HTTP-only cookies)
- **Password Hashing:** bcrypt
- **Session:** Server-side sessions (stored in database)
- **Protected Routes:** TanStack Router `beforeLoad` checks

### Backend
- **Server Functions:** TanStack Start server functions (RPC-style)
- **API Pattern:** Server functions called from components
- **Validation:** Zod for input validation

### Frontend
- **Components:** shadcn/ui
- **Icons:** Lucide React (already installed)
- **State:** TanStack Query for server state
- **Forms:** TanStack Form + Zod
- **Analytics:** PostHog (user tracking, funnel analysis)
- **Error Tracking:** Sentry (error monitoring, performance tracking)

### Development Tools
- **Build Tool:** Vite
- **Package Manager:** pnpm
- **Testing:** Vitest (already configured)
- **Deployment:** Cloudflare Workers (wrangler)

### Project Structure
```
bidding-app/
├── src/
│   ├── routes/           # TanStack routes (file-based)
│   │   ├── __root.tsx   # Root layout
│   │   ├── index.tsx    # Landing page
│   │   ├── sign-in.tsx  # Login page
│   │   ├── sign-up.tsx  # Register page
│   │   └── app/         # Protected app routes
│   │       ├── index.tsx        # Dashboard/collections list
│   │       └── collections/
│   │           └── $id.tsx      # Collection detail
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn components
│   │   ├── collection-card.tsx
│   │   ├── bid-table.tsx
│   │   └── auth-forms/
│   ├── lib/             # Utilities
│   │   ├── db/          # Database config & schema
│   │   ├── auth/        # Auth utilities
│   │   └── utils.ts     # Helpers
│   ├── hooks/           # Custom hooks
│   └── styles/          # Global styles
├── docs/                # Project documentation
│   ├── project-state.md # This file
│   └── product-marketing-context.md
├── public/              # Static assets
└── package.json
```

### Dependencies to Install
```bash
# Database (Neon PostgreSQL + Drizzle)
pnpm add @neondatabase/serverless drizzle-orm
pnpm add -D drizzle-kit

# Auth
pnpm add bcryptjs
pnpm add -D @types/bcryptjs

# Forms & Validation (TanStack Form)
pnpm add @tanstack/react-form zod

# UI Components (shadcn)
# Use shadcn CLI to add: button, card, dialog, form, table, input, label

# Analytics & Monitoring
pnpm add posthog-js @sentry/react @sentry/tracing
```

### Environment Variables
Create `.env` file:
```env
# Database
DATABASE_URL="postgresql://username:password@hostname/dbname?sslmode=require"

# Auth
SESSION_SECRET="your-super-secret-session-key-min-32-chars"

# Analytics (PostHog)
VITE_POSTHOG_KEY="ph_project_api_key"
VITE_POSTHOG_HOST="https://us.i.posthog.com"

# Error Tracking (Sentry)
VITE_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_AUTH_TOKEN="sentry_auth_token_for_source_maps"
```

---

## Current Status

### Completed
- [x] Project initialized (TanStack Start)
- [x] Product marketing context created
- [x] Project state document created (this file)

### In Progress
- [ ] Neon PostgreSQL database setup
- [ ] Drizzle ORM configuration
- [ ] Schema design
- [ ] Seed data generation (100+ collections, 1000+ bids, 10+ users)

### Pending
- [ ] Authentication system (custom email/password)
- [ ] Server functions (CRUD operations)
- [ ] Landing page UI
- [ ] Collection list UI (nested table)
- [ ] Bid management UI
- [ ] Forms (TanStack Form + Zod)
- [ ] PostHog analytics integration
- [ ] Sentry error tracking setup
- [ ] README documentation
- [ ] Monitoring/scalability docs

---

## Key Decisions

### Why TanStack Start?
- Workspace already configured for TanStack Start
- Excellent DX with RPC-style server functions
- File-based routing already set up
- Demonstrates modern React framework knowledge

### Why PostgreSQL (Neon) instead of SQLite?
- Production-grade database
- Serverless Postgres fits well with TanStack Start on Cloudflare Workers
- Better for demonstrating real-world skills
- Can handle concurrent writes better than SQLite

### Why Custom Auth instead of Clerk/Auth0?
- Shows understanding of auth fundamentals
- Simpler for coding challenge context
- No external service dependencies
- Email/password is universally understood

### Why TanStack Form?
- Native TanStack ecosystem integration
- Better performance with fine-grained reactivity
- Headless design works perfectly with shadcn/ui
- Type-safe by default

### Why Blur.io-inspired Design?
- Premium aesthetic differentiates from generic demos
- Dark theme is modern and professional
- NFT marketplace patterns translate well to physical collectibles
- Shows attention to UX/UI details

---

## Next Steps for Next Agent

1. **Database Setup:**
   - Sign up for Neon (free tier)
   - Install Drizzle ORM + Neon adapter
   - Create schema (users, collections, bids)
   - Generate and run migrations
   - Create seed script (100+ collections, 1000+ bids, 10+ users)

2. **Authentication:**
   - Create auth utilities (hash password, verify password, session management)
   - Create server functions (signUp, signIn, signOut, getSession)
   - Create login/register pages with TanStack Form
   - Set up protected route middleware with beforeLoad

3. **Core Features:**
   - Collection list page with nested bid tables
   - Create/update collection forms (TanStack Form)
   - Place/edit/cancel bid functionality
   - Accept bid (with auto-reject others logic)

4. **UI Polish:**
   - Install shadcn components
   - Implement dark theme with amber accents
   - Add loading states and error handling
   - Responsive design

---

## Resources

### Documentation
- [Product Marketing Context](./product-marketing-context.md)
- [Challenge Requirements](https://github.com/LuxorLabs/frontend-coding-challenge)

### Design References
- Blur.io (NFT marketplace aesthetic)
- Christie's/Sotheby's (auction house elegance)
- OpenSea (Web3 UX patterns)

### Technical References
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Form Docs](https://tanstack.com/form/latest)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)

---

## Notes for Future Agents

**If resuming this project:**
1. Read this file first
2. Read the product marketing context
3. Check `package.json` for current dependencies
4. Look at existing routes in `src/routes/`
5. Run `pnpm dev` to see current state

**Important:**
- Use real copy from marketing context, not placeholder text
- Maintain dark premium aesthetic throughout
- Keep code clean and well-commented
- Test all CRUD operations before moving to next feature
- Update this file as progress is made

**Questions?** Check the challenge requirements or marketing context first.

---

*This document should be updated as the project progresses. Mark tasks as complete and add new context as decisions are made.*
