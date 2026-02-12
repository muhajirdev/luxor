# Key Decisions

Unique choices and patterns used in the development of Luxor Bids.

## 1. Frontend Pattern: Composition + ID-based Selection
We use the **State Colocation + ID-based Selection + Composition** pattern for complex UI components (like the collections table).

- **Flexibility**: Composition (Radix-style) lets us rearrange, style, or swap pieces independently.
- **No Prop Drilling**: State colocation + local context ensures data is only available where needed.
- **Performance**: Passing primitive IDs instead of full objects allows React's default `memo` to work perfectly without custom comparison functions.

See ["Composition Is All You Need" by Fernando Rojo](https://www.youtube.com/watch?v=4KvbVq3Eg5w) for the inspiration behind this pattern.

## 2. Type-Safe Architecture (RPC over REST)
We explicitly chose **TanStack Start Server Functions** instead of traditional REST or GraphQL APIs.

- **100% Type Safety**: Types flow naturally from the database schema to the UI components without manual interface synchronization.
- **Zero Boilerplate**: No need to define endpoints, fetchers, or serialization logic.
- **DX**: Backend logic is colocated or easily imported, making the request-response cycle feel like simple function calls.

## 3. Type-Safe Event Tracking
Analytics are not just strings. We use a TypeScript-first tracking approach.

- **Autocomplete**: Event names and properties are fully autocompleted in the IDE.
- **Validation**: TypeScript ensures required properties are provided and have the correct types.
- **Self-Documenting**: The tracking plan is auto-generated from the code, ensuring documentation never drifts from implementation.

## 4. Explicit Database Queries
We enforce the use of explicit query builders (`db.select()`, `db.insert()`) over `db.query`.

- **Control**: Every join and selection is explicit, preventing accidental "over-fetching" or hidden performance traps.
- **Type Safety**: Drizzle's query builder provides superior type inference for complex joins compared to the higher-level `query` API.

## 5. Custom Auth for MVP
Instead of reaching for a managed service (Clerk/Auth0) immediately, we built a secure, database-backed session system.

- **Simplicity**: No external dependencies or complicated redirect flows for the MVP.
- **Control**: Total control over the session lifecycle and cookie security (HTTP-only).
- **Extensibility**: Designed to be easily replaced by managed providers as requirements grow.
