# Architecture Decisions

## Core Framework: TanStack Start
- **RPC-style server functions**: Eliminates REST/GraphQL boilerplate while maintaining 100% type safety.
- **File-based routing**: Provides an intuitive structure for the application.
- **Modern React**: Leverages the latest React patterns (Suspense, Transitions) for a smooth UX.

## Platform: Cloudflare Workers
We chose Cloudflare Workers as our deployment platform for its global reach and performance.

- **Edge Computing**: Logic runs at the edge, closest to our users, resulting in minimal latency.
- **Serverless**: Scales automatically without manual infrastructure management.
- **Durable Objects (Future)**: We plan to migrate real-time bidding to **Cloudflare Durable Objects**. This will provide a stateful, low-latency coordination point for each auction, enabling true WebSocket-based real-time updates without the overhead of traditional server-side state management.

## Database: PostgreSQL (Neon)
- **Serverless Scaling**: Matches the serverless nature of Cloudflare Workers.
- **ACID Compliance**: Crucial for ensuring integrity in bidding transactions.
- **Neon Branching**: Allows us to create isolated database environments for testing and development.

## Form Management: TanStack Form
- **Type-safe by default**: Integrated deeply with Zod for schema validation.
- **Performance**: Fine-grained reactivity ensures only the changed fields re-render.
- **Headless**: Works seamlessly with our custom shadcn/ui styling.

## Authentication
- **Session-based**: We use database-backed sessions with HTTP-only cookies for maximum security and control over the login lifecycle.
