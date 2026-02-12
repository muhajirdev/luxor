# Luxor Bids

A premium full-stack bidding marketplace where serious collectors bid with confidence. Built with TanStack Start, PostgreSQL, and Tailwind CSS.

## Features

- **Collection Management** - Create, edit, and manage collectible item listings
- **Bidding System** - Place, update, and cancel bids on collections
- **Accept Bid Workflow** - Collection owners can accept bids (auto-rejects all others)
- **Nested Table UI** - Expandable collections showing all associated bids
- **Role-Based Controls** - Different permissions for collection owners vs bidders
- **Dark Premium Design** - Blur.io-inspired aesthetic with amber accents

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
```

## Project Structure

```
bidding-app/
├── src/
│   ├── routes/              # TanStack routes (file-based)
│   │   ├── __root.tsx      # Root layout
│   │   ├── index.tsx       # Landing page
│   │   ├── login.tsx       # Login page
│   │   ├── register.tsx    # Registration page
│   │   ├── collections.tsx # Collections list page
│   │   └── ...
│   ├── components/          # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   └── Header.tsx      # Navigation header
│   ├── lib/                # Utilities
│   │   ├── db/            # Database schema & client
│   │   ├── auth/          # Authentication utilities
│   │   └── utils.ts       # Helper functions
│   ├── hooks/             # Custom React hooks
│   └── styles/            # Global styles
├── drizzle/               # Database migrations
├── docs/                  # Project documentation
├── public/                # Static assets
└── package.json
```

## Database Schema

### Users
- `id`, `email`, `password_hash`, `name`, `created_at`

### Collections
- `id`, `name`, `description`, `stocks`, `price`, `owner_id`, `status`, `created_at`

### Bids
- `id`, `collection_id`, `price`, `user_id`, `status` (pending/accepted/rejected), `created_at`

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
- Shows understanding of auth fundamentals
- No external service dependencies
- Simpler for challenge context

### Why TanStack Form?
- Native TanStack ecosystem integration
- Fine-grained reactivity for better performance
- Type-safe by default
- Headless design works with shadcn/ui

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

## Documentation

- [Project State](./docs/project-state.md) - Current progress and roadmap
- [Product Marketing Context](./docs/product-marketing-context.md) - Brand guidelines and messaging
- [TODO List](./TODO.md) - Development tasks and priorities

## License

[MIT License](./LICENSE)
