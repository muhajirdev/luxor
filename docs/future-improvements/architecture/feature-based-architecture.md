# Feature-Based Architecture

**Status:** Planned for post-MVP

## Overview

Move from layer-centric (`/components`, `/hooks`) to feature-centric structure for better code colocation and maintainability.

## Current Structure (Layer-Centric)

```
src/
├── components/          # All components mixed
├── hooks/              # All hooks mixed
├── lib/                # Utilities
└── routes/             # Routes reference scattered components
```

## Proposed Structure (Feature-Centric)

```
src/
├── features/
│   ├── collections/
│   │   ├── components/
│   │   │   ├── CollectionCard.tsx
│   │   │   ├── CollectionList.tsx
│   │   │   └── CollectionForm.tsx
│   │   ├── hooks/
│   │   │   ├── useCollections.ts
│   │   │   └── useCollection.ts
│   │   ├── server/
│   │   │   ├── getCollections.server.ts
│   │   │   └── createCollection.server.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── bidding/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   └── types.ts
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── server/
│       └── types.ts
├── shared/
│   ├── components/     # Truly shared UI (Button, Modal, etc.)
│   ├── hooks/          # Truly shared hooks
│   └── utils/
└── routes/
    └── ...             # Routes import from features
```

## Benefits

- ✅ Related code lives together (components, hooks, server functions)
│   ├── Easier to find and modify code
│   ├── Clearer ownership of features
│   ├── Simpler testing (feature tests in one place)
│   ├── Better for code splitting and lazy loading

## Migration Strategy

1. Identify core features (collections, bidding, auth)
2. Create `src/features/` folder
3. Move code feature by feature (start with smallest)
4. Update imports incrementally
5. Keep shared utilities in `src/shared/`

## When to Implement

- After MVP is stable
- Before adding major new features
- When codebase exceeds 50 components
