# Getting Started

## Prerequisites

- Node.js 18+
- pnpm package manager
- PostgreSQL database (Neon recommended)

## Installation

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

## Test Accounts

After seeding the database, you can log in with any of these test accounts:

**All accounts use password:** `password123`

| Email | Name |
|-------|------|
| `admin@luxorbids.com` | Admin User |
| `sarah.mitchell@email.com` | Sarah Mitchell |
| `james.chen@email.com` | James Chen |
| `maria.rodriguez@email.com` | Maria Rodriguez |
| `robert.williams@email.com` | Robert Williams |
| `elizabeth.taylor@email.com` | Elizabeth Taylor |
| `david.kim@email.com` | David Kim |
| `emily.johnson@email.com` | Emily Johnson |
| `michael.brown@email.com` | Michael Brown |
| `jennifer.davis@email.com` | Jennifer Davis |

The seed data includes 15 users with 120+ collections and realistic bid history.
