# Future Improvements

This folder contains detailed specifications for planned enhancements and architectural decisions.

## Architecture

- [Monorepo Migration](./architecture/monorepo.md) - Migration to Turborepo/Nx structure
- [Feature-Based Architecture](./architecture/feature-based-architecture.md) - Move from layer-centric to feature-centric code organization

## Features

- [Enhanced Authentication](./features/enhanced-authentication.md) - Forgot password, Google OAuth, security improvements
- [Real-Time Updates](./features/real-time-updates.md) - WebSocket/SSE for live bidding
- [Notifications](./features/notifications.md) - Email and push notifications
- [Payment Integration](./features/payment-integration.md) - Stripe Connect escrow system
- [Search & Discovery](./features/search-discovery.md) - Full-text search with PostgreSQL
- [Image Upload](./features/image-upload.md) - Cloudflare R2 + image optimization
- [Payment Verification](./features/payment-verification.md) - Pre-bid payment verification
- [Ownership History](./features/ownership-history.md) - Provenance tracking for collectibles

## Performance

- [Cloudflare Hyperdrive](./performance/cloudflare-hyperdrive.md) - Database connection pooling and caching
- [Caching Strategy](./performance/caching-strategy.md) - Redis, CDN, and query optimization
- [Concurrency Handling](./performance/concurrency.md) - Race condition solutions for bid acceptance

## Monitoring

- [Sentry](./monitoring/sentry.md) - Error tracking and performance monitoring
- [PostHog](./monitoring/posthog.md) - Product analytics and user behavior
- [Uptime Monitoring](./monitoring/uptime.md) - Website and API health checks
- [Discord Alerts](./monitoring/discord-alerts.md) - Real-time critical alerts
- [Axiom Logging](./monitoring/axiom.md) - Centralized structured logging

## Design

- [Full Design System](./design/design-system.md) - Comprehensive design system beyond MVP guidelines

---

*Last Updated: February 12, 2026*
