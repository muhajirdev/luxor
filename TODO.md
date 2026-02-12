# TODO - Luxor Bids Development

*Last Updated: February 12, 2026 - Portfolio page created with user dashboard*

**Quick Start:** Pick any unchecked task, implement it, check it off. Update this file as you go.

---

## Phase 1: Foundation (Do First)

### Database Setup
- [ ] Install dependencies: `@neondatabase/serverless drizzle-orm`
- [ ] Install dev dependencies: `drizzle-kit`
- [ ] Sign up for Neon (free tier) and create database
- [ ] Add `DATABASE_URL` to `.env` file
- [ ] Create `src/lib/db/index.ts` - database connection setup
- [ ] Create `src/lib/db/schema.ts` with tables:
  - `users` (id, email, password_hash, name, created_at)
  - `collections` (id, name, description, stocks, price, owner_id, status, created_at)
  - `bids` (id, collection_id, price, user_id, status, created_at)
- [ ] Create `drizzle.config.ts`
- [ ] Run `pnpm drizzle-kit generate` to create migrations
- [ ] Run `pnpm drizzle-kit migrate` to apply to database
- [ ] Create `src/lib/db/seed.ts` with:
  - 10+ users with realistic names
  - 100+ collections with variety (vintage cameras, art, books, etc.)
  - 1000+ bids distributed across collections
- [ ] Run seed script and verify data in Neon dashboard

### Authentication
- [ ] Install `bcryptjs` and `@types/bcryptjs`
- [ ] Create `src/lib/auth/password.ts` - hashPassword() and verifyPassword()
- [ ] Create `src/lib/auth/session.ts` - createSession(), getSession(), destroySession()
- [ ] Create `src/lib/auth/middleware.ts` - requireAuth() for protected routes
- [ ] Create `src/routes/sign-up.tsx` - registration page
- [ ] Create `src/routes/sign-in.tsx` - login page
- [ ] Create server function: `signUpUser(email, password, name)`
- [ ] Create server function: `signInUser(email, password)`
- [ ] Create server function: `signOutUser()`
- [ ] Add `beforeLoad` auth check to `/app/*` routes
- [ ] Test: Can register → login → access protected routes

---

## Phase 2: Core Features

### Collections API
- [ ] Create server function: `getCollections()` - list all with pagination
- [ ] Create server function: `getCollectionById(id)` - single collection
- [ ] Create server function: `createCollection(data)` - protected
- [ ] Create server function: `updateCollection(id, data)` - owner only
- [ ] Create server function: `deleteCollection(id)` - owner only
- [ ] Add Zod validation for all collection inputs
- [ ] Test all collection CRUD operations

### Bids API
- [x] Create server function: `getBidsByCollection(collectionId)` ✅ Done - fetches real bids from DB
- [x] Create server function: `placeBid(collectionId, amount)` - bidder only ✅ Done
- [ ] Create server function: `updateBid(bidId, amount)` - bid owner only
- [ ] Create server function: `cancelBid(bidId)` - bid owner only
- [x] Create server function: `acceptBid(collectionId, bidId)` - collection owner only ✅ Done
- [x] Implement accept bid logic: mark accepted, reject all others ✅ Done (stock-based)
- [x] Add Zod validation for all bid inputs ✅ Done
- [x] Test bid lifecycle: place → accept → verify rejection ✅ Done

### Portfolio Page
- [x] Create `/portfolio` route with user dashboard
- [x] Stats overview cards (active listings, sold items, active bids, total value)
- [x] "My Collections" section showing user's owned collections
- [x] "My Bids" section showing user's active and past bids
- [x] Authentication check using `getCurrentUser` in loader
- [x] Redirect to login if not authenticated
- [x] Empty states for no collections/no bids
- [x] Header navigation showing "Portfolio" instead of username
- [x] Server functions: `getUserCollectionsServer`, `getUserBidsServer`

### UI Components (shadcn)
- [ ] Initialize shadcn: `npx shadcn-ui@latest init`
- [ ] Add components: `button`, `card`, `dialog`, `input`, `label`, `table`
- [ ] Add components: `form`, `select`, `badge`, `avatar`, `dropdown-menu`
- [ ] Verify dark theme works with existing Tailwind setup

---

## Phase 3: User Interface

### Layout & Navigation
- [x] Update `src/routes/__root.tsx` with dark theme background
- [x] Header with logo "Luxor Bids"
- [x] Navigation: Catalog | Guide | Portfolio
- [x] User auth state in header (Login/Portfolio link)
- [x] Mobile-responsive navigation
- [x] Global styles for dark theme with amber accents

### Portfolio Page (`/portfolio`)
- [x] User dashboard with stats overview
- [x] "My Collections" section
- [x] "My Bids" section
- [x] Authentication required

### Landing Page (`/index.tsx`)
- [ ] Hero section with headline: "Where serious collectors bid with confidence"
- [ ] Subheadline with value prop
- [ ] CTA buttons: "Browse Collections" / "Start Selling"
- [ ] Featured collections grid (4-6 items)
- [ ] Stats section: "X collections" / "Y bids placed" / "Z happy collectors"
- [ ] Footer with links

### Collections List Page (`/collections`)
- [x] Table with columns: Image | Name | Price | Bids | Status | Actions ✅ Done
- [x] Expandable rows to show bids table ✅ Done
- [x] Nested bids table: Bidder | Amount | Status | Time | Actions ✅ Done (dynamic from DB)
- [x] Search bar ✅ Done - Server-side search with debounce
- [x] **Filter bar** ✅ Done - Status, price range, "My Collections" toggle
- [x] **"Yours" badge** ✅ Done - Shows on owned collections
- [ ] Pagination (20 items per page) - UI done, needs page switching
- [ ] Empty state for no collections

### Collection Detail Page (`/app/collections/$id.tsx`)
- [ ] Collection image/header
- [ ] Collection info: name, description, owner, price, stock
- [ ] Bids list with current highest bid highlighted
- [ ] Place bid form (if not owner)
- [ ] Accept bid button on each bid row (if owner)
- [ ] Edit/Delete collection buttons (if owner)

### Forms
- [ ] Create collection form (TanStack Form + Zod):
  - Name, Description, Price, Stock fields
  - Validation: required fields, positive numbers
- [ ] Edit collection form (pre-filled)
- [ ] Place bid form:
  - Amount input with validation (must be > current price)
  - Submit button
- [ ] Edit bid form (change amount)
- [ ] All forms: loading states, error messages, success redirects

---

## Phase 4: Owner & Bidder Controls

### Owner Features
- [x] Show "Yours" badge on user's collections ✅ Done - Bronze badge indicator
- [x] Accept bid button on bid rows → confirmation → updates all bids ✅ Done
- [x] Show "Sold" status when bid accepted ✅ Done - Collection marked as sold
- [ ] Edit collection button → opens edit form modal
- [ ] Delete collection button → confirmation dialog → soft delete
- [ ] Stock-based auto-rejection ✅ Done - Auto-rejects when stock=0

### Bidder Features
- [ ] Show "Your Bid" badge on user's bids
- [ ] Edit bid button → edit amount
- [ ] Cancel bid button → confirmation → delete bid
- [ ] Show "Outbid" warning when higher bid placed
- [ ] Disable bidding on own collections

---

## Phase 5: Analytics & Monitoring

### PostHog Setup
- [ ] Install `posthog-js`
- [ ] Add `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` to `.env`
- [ ] Initialize PostHog in `src/lib/analytics/posthog.ts`
- [ ] Track events:
  - Page views (landing, collections, auth)
  - Sign up / Sign in
  - Collection created
  - Bid placed
  - Bid accepted
- [ ] Identify users after login

### Sentry Setup
- [ ] Install `@sentry/react` and `@sentry/tracing`
- [ ] Add `VITE_SENTRY_DSN` to `.env`
- [ ] Initialize Sentry in `src/lib/errors/sentry.ts`
- [ ] Add error boundary component
- [ ] Track API errors in server functions
- [ ] Set up source maps for production builds

---

## Phase 6: Polish & Documentation

### Error Handling
- [ ] Add error boundaries for route errors
- [ ] Handle network errors gracefully
- [ ] Show toast notifications for success/error actions
- [ ] Form validation errors inline

### Loading States
- [ ] Skeleton loaders for collection cards
- [ ] Table loading states
- [ ] Button loading spinners
- [ ] Page transition loading

### Responsive Design
- [ ] Test on mobile (320px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px)
- [ ] Fix any layout issues

### README
- [ ] Installation instructions
- [ ] Environment variables setup
- [ ] How to run locally
- [ ] Database setup guide
- [ ] Deployment instructions

### Final Deliverables
- [ ] Document: How to monitor the application
- [ ] Document: Scalability and performance strategy
- [ ] Document: Trade-offs made during development
- [ ] Create GitHub repository
- [ ] Push code and share with reviewers

---

## Quick Reference

### Commands
```bash
# Dev server
pnpm dev

# Database
pnpm drizzle-kit generate  # Create migration
pnpm drizzle-kit migrate   # Run migration
pnpm tsx src/lib/db/seed.ts  # Run seed

# Add shadcn component
npx shadcn-ui@latest add button
```

### File Locations
- Routes: `src/routes/*.tsx`
- Server functions: `src/routes/*.server.ts` or inline in routes
- Database: `src/lib/db/`
- Auth: `src/lib/auth/`
- Components: `src/components/`
- Utils: `src/lib/utils.ts`

### Key Decisions
- Use server functions in route files (RPC-style)
- TanStack Form for all forms
- Zod for all validation
- shadcn/ui for all UI components
- Dark theme only (no light mode for MVP)

---

## Notes

**When picking a task:**
1. Check off dependencies first
2. Test after each major feature
3. Update this file when done
4. Ask if stuck!

**Style guide:**
- Use real copy from `docs/product-marketing-context.md`
- No "lorem ipsum" or placeholder text
- Dark theme with amber (#f59e0b) accents
- Monospace font for prices and stats
