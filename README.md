# Luxor Bids

A premium full-stack bidding marketplace where serious collectors bid with confidence. Built with TanStack Start, PostgreSQL, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Set up database
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm tsx src/lib/db/seed.ts

# Start dev server
pnpm dev
```

See [Getting Started Guide](./docs/getting-started.md) for detailed setup instructions.

## Documentation

- **[Getting Started](./docs/getting-started.md)** - Installation and setup
- **[Architecture Decisions](./docs/architecture-decisions.md)** - Why TanStack Start, PostgreSQL, and key design choices
- **[Development Tools](./docs/development-tools.md)** - React Scan and debugging
- **[Deployment](./docs/deployment.md)** - Deploy to Cloudflare Workers
- **[API Documentation](./docs/api.md)** - API endpoint reference
- **[Architecture](./docs/architecture.md)** - System architecture and patterns
- **[Project State](./docs/project-state.md)** - Current progress and roadmap
- **[Contributing](./docs/contributing.md)** - Development guidelines

### Additional Documentation

- **[User Flows](./docs/user-flows.md)** - User journey documentation
- **[Product Marketing Context](./docs/product-marketing-context.md)** - Positioning and target audience
- **[Brand Voice](./docs/brand-voice.md)** - Tone and messaging guidelines
- **[Design Guidelines](./docs/design-guidelines.md)** - Visual design system
- **[Analytics Tracking](./docs/analytics-tracking.md)** - Type-safe analytics implementation

## Features

- **Collection Management** - Create, edit, and manage collectible item listings
- **Bidding System** - Place, update, and cancel bids on collections
- **Accept Bid Workflow** - Collection owners can accept bids (auto-rejects all others)
- **Nested Table UI** - Expandable collections showing all associated bids
- **Role-Based Controls** - Different permissions for collection owners vs bidders
- **Dark Premium Design** - Blur.io-inspired aesthetic with amber accents
- **Type-Safe Analytics** - 100% TypeScript-autocomplete for event tracking with auto-generated docs

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

## Available Scripts

```bash
pnpm dev                   # Start dev server on port 3000
pnpm build                 # Production build
pnpm test                  # Run all tests
pnpm deploy                # Deploy to Cloudflare Workers
pnpm improvements          # List future improvements
pnpm generate:tracking-plan # Generate analytics tracking documentation
```

See [package.json](./package.json) for all scripts.

## Database

- **Schema**: [src/lib/db/schema.ts](./src/lib/db/schema.ts)
- **Migrations**: [drizzle/](./drizzle/)

See [Future Improvements](./docs/future-improvements/) for planned enhancements.

## Production Readiness

- **[Monitoring & Observability](./docs/production/monitoring.md)** - How to monitor the application
- **[Scalability & Performance](./docs/production/scalability.md)** - Scaling strategy
- **[Trade-offs](./docs/production/tradeoffs.md)** - Decisions made and future improvements

## License

[MIT License](./LICENSE)
