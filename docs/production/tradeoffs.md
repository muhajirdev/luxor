# Trade-offs & Future Improvements

> **Q: Trade-offs you had to choose when doing this challenge (the things you would do different with more time and resources)**

Decisions made for rapid MVP delivery and what we'd do differently with more resources:

## 1. Custom Authentication vs Managed Auth
**Current:** Custom email/password with HTTP-only cookies
- ✅ Fast to implement, no vendor lock-in, full control
- ❌ Missing password reset, OAuth, rate limiting, account lockout

**Future:** Migrate to [enhanced auth](../future-improvements/features/enhanced-authentication.md) or Clerk/Auth0
- Forgot password flow, Google OAuth, email verification
- Rate limiting, device fingerprinting, audit logging
- Multi-factor authentication for high-value transactions

## 2. Polling vs Real-Time Updates
**Current:** Client-side polling for bid updates (TanStack Query refetch)
- ✅ Simple infrastructure, works everywhere, no connection management
- ❌ Delayed updates, unnecessary network traffic, poor UX during active bidding

**Future:** [WebSocket or SSE integration](../future-improvements/features/real-time-updates.md)
- PartyKit (Cloudflare edge) or Socket.io for live bid updates
- Instant outbid notifications
- Real-time collection status changes

## 3. External Image URLs vs Upload System
**Current:** Collection images via external URLs (Unsplash)
- ✅ No storage costs or complexity, instant setup
- ❌ Poor UX (users can't upload), dependency on external services, no image optimization

**Future:** [R2 Image Upload](../future-improvements/features/image-upload.md)
- Direct uploads with validation and resizing
- CDN delivery with automatic optimization
- Support for multiple images per collection

## 4. Testing Coverage
**Current:** Limited test coverage focused on critical paths
- ✅ Faster iteration during MVP phase
- ❌ Risk of regressions, slower confident refactors

**Future:** Comprehensive test suite
- Unit tests for all server functions
- Integration tests for bidding workflows
- E2E tests for critical user journeys

## 5. Payment Integration
**Current:** No payment processing (bidding only)
- ✅ Simplified MVP, no PCI compliance complexity
- ❌ No way to collect deposits or finalize transactions

**Future:** [Stripe Integration](../future-improvements/features/payment-integration.md)
- Bid deposits to prevent spam
- Automatic payment capture on bid acceptance
- Escrow system for high-value items

## 6. Search & Discovery
**Current:** Basic text search on name/description
- ✅ Simple implementation, fast enough for MVP scale
- ❌ No faceted search, no recommendations, limited discovery

**Future:** [Advanced Search](../future-improvements/features/search-discovery.md)
- Full-text search with Algolia/Typesense
- Category-based filtering and sorting
- Recommendation engine based on bidding history

See [../future-improvements/](../future-improvements/) for complete roadmap and implementation details.
