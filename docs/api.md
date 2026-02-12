# API Documentation

> **Architecture Note:** This application primarily uses [TanStack Start server functions](https://tanstack.com/start/latest/docs/framework/react/server-functions) (RPC-style) instead of traditional REST API endpoints. This approach provides 100% end-to-end TypeScript type safety, enables faster development, and is more LLM-friendly for AI-assisted coding.
>
> Traditional REST endpoints can be added in the future if needed for external integrations or third-party API consumers. For now, server functions deliver the best developer experience and type safety.

## Health Check

**Endpoint:** `GET /api/health`

Returns the service health status, useful for monitoring and load balancers.

**Response (200 - Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-12T12:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 12
    },
    "environment": {
      "status": "healthy",
      "region": "SJC",
      "cfRay": "8f9a2b..."
    }
  }
}
```

**Response (503 - Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2026-02-12T12:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "unhealthy",
      "responseTime": 5000,
      "message": "Connection timeout"
    },
    "environment": {
      "status": "healthy",
      "region": "SJC",
      "cfRay": "8f9a2b..."
    }
  }
}
```

**Check Details:**
- **Database**: Validates PostgreSQL connectivity with response time
- **Environment**: Shows Cloudflare datacenter region and request ID for debugging
