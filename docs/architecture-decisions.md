# Architecture Decisions

## Why TanStack Start?
- Workspace already configured for TanStack Start
- RPC-style server functions eliminate REST boilerplate
- File-based routing is intuitive
- Demonstrates modern React framework knowledge

## Why PostgreSQL (Neon)?
- Production-grade database with serverless scaling
- Better concurrent write handling than SQLite
- Fits well with Cloudflare Workers deployment

## Why Custom Authentication?
Simple for MVP — we can migrate to managed auth (Clerk/Auth0) later if needed.

## Why TanStack Form?
- Native TanStack ecosystem integration
- Fine-grained reactivity for better performance
- Type-safe by default
- Headless design works with shadcn/ui

## Key Decisions

### Component Architecture Pattern
We use **State Colocation + ID-based Selection + Composition** for complex UI components:

- **Flexibility**: Composition lets you rearrange, style, or swap pieces independently  
- **No Prop Drilling**: State colocation + context gets data where it's needed
- **Performance**: Primitive props work with default `React.memo`—no custom comparison needed

See [architecture.md](./architecture.md) and ["Composition Is All You Need" by Fernando Rojo](https://www.youtube.com/watch?v=4KvbVq3Eg5w).

### Design System (MVP)
Using [Design Guidelines](./design-guidelines.md) optimized for rapid AI-assisted development. A full design system will be built post-MVP.

### Type-Safe Architecture
**No REST APIs.** Using TanStack Start server functions for 100% end-to-end type safety from database to UI.

### Type-Safe Event Tracking
Analytics events are defined as a TypeScript constant with type-inferred properties. TypeScript provides autocomplete for event names and validates property types at compile time. Documentation is auto-generated from the code, ensuring it never goes out of sync.

### Database
PostgreSQL (Neon) with explicit query builders via Drizzle ORM for type-safe data access.
