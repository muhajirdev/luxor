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

## 4. Payment Integration
**Current:** No payment processing (bidding only)
- ✅ Simplified MVP, no PCI compliance complexity
- ❌ No way to collect deposits or finalize transactions

**Future:** [Stripe Integration](../future-improvements/features/payment-integration.md)
- Bid deposits to prevent spam
- Automatic payment capture on bid acceptance
- Escrow system for high-value items

## 5. Component Architecture - Composition Pattern
**Current:** We use the **State Colocation + ID-based Selection + Composition** pattern for complex UI components (see [architecture decisions](../architecture-decisions.md))
- ✅ Flexible composition, no prop drilling, optimal performance with default React.memo
- ✅ Works well with ID-based selection - components select their own data
- ❌ Steeper learning curve, requires understanding of Radix UI-like patterns
- ❌ More boilerplate for simple components

**What we'd do with more time:**
- Build a more generalized component library following this pattern
- Add more comprehensive documentation and examples
- Consider creating reusable primitives for common patterns
- Evaluate when to use this pattern vs simpler approaches

## 6. Design System
**Current:** Using [design guidelines](../design-guidelines.md) for consistency
- ✅ Results in consistent, premium aesthetic across the app
- ✅ Very fast iteration - no Storybook overhead, direct implementation
- ❌ No Storybook for component documentation and testing
- ❌ Limited reusable component library - many one-off implementations
- ❌ No visual regression testing

**Future:** Build proper design system with Storybook
- Document all components in isolation
- Create reusable component library with proper variants
- Add visual regression testing (Chromatic)
- Better designer-developer handoff

## 7. Search & Discovery
**Current:** Basic text search with `LIKE` queries on name/description
- ✅ Simple implementation, fast enough for MVP scale
- ❌ No typo tolerance - "rolex" won't match "rollex"
- ❌ No faceted search, no recommendations, limited discovery

**Future:** Full-text search with typo tolerance and semantic capabilities
- Implement [pg_trgm](https://neon.com/docs/extensions/pg_trgm) for fuzzy matching and typo tolerance
- Full-text search with PostgreSQL `tsvector` for better relevance
- Semantic search (transform titles/descriptions into embeddings) - powerful but overkill for current scale
- Category-based filtering, recommendations based on bidding history

See [../future-improvements/](../future-improvements/) for complete roadmap and implementation details.
