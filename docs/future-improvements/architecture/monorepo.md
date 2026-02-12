# Monorepo Migration

**Status:** Planned for post-MVP

## Rationale

As the application grows, a monorepo structure will provide better code organization, shared packages, and team scalability.

## Proposed Structure

```
luxor-bids/
├── apps/
│   ├── web/                    # Current TanStack Start app
│   ├── mobile/                 # Future React Native app
│   └── admin/                  # Future admin dashboard
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── database/               # Drizzle schema & migrations
│   ├── auth/                   # Shared auth utilities
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # Shared config (eslint, tsconfig, etc.)
├── docs/                       # Documentation
└── tooling/                    # Scripts and automation
```

## Tools to Consider

- **Turborepo** — Fast builds, excellent caching, great DX
- **Nx** — More features, better for large teams
- **pnpm workspaces** — Native monorepo support

## Migration Strategy

1. Set up pnpm workspaces in root
2. Move shared code to `packages/`
3. Extract database layer to `packages/database`
4. Extract auth utilities to `packages/auth`
5. Gradually migrate app code to `apps/web`

## Benefits

- ✅ Code sharing between apps (same auth, same types)
- ✅ Atomic deployments (all apps deploy together)
- ✅ Unified versioning and changelog
- ✅ Easier testing across packages
- ✅ Better dependency management

## When to Implement

- After MVP is complete and stable
- When starting a second app (mobile or admin)
- When team size grows beyond 2-3 developers
