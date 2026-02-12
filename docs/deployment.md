# Deployment

## Cloudflare Workers

1. Configure `wrangler.jsonc` with your account details
2. Run the deploy command:
```bash
pnpm deploy
```

## Environment Variables for Production

Ensure this is set in your deployment environment:

- `DATABASE_URL` - PostgreSQL connection string

## Build Process

1. Vite builds client bundle
2. Worker script bundled with Wrangler
3. Deployed to Cloudflare edge

## Preview Before Deploy

```bash
pnpm preview
```

This builds and previews the application locally before deploying to production.
