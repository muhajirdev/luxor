import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    database: {
      status: 'healthy' | 'unhealthy'
      responseTime: number
      message?: string
    }
    environment: {
      status: 'healthy'
      region: string | null
      cfRay: string | null
    }
  }
}

async function checkDatabase(): Promise<HealthCheck['checks']['database']> {
  const start = performance.now()
  try {
    await db.execute(sql`SELECT 1`)
    return {
      status: 'healthy',
      responseTime: Math.round(performance.now() - start),
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Math.round(performance.now() - start),
      message: error instanceof Error ? error.message : 'Database connection failed',
    }
  }
}

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cfRay = request.headers.get('cf-ray')
        const region = (request as { cf?: { colo?: string } }).cf?.colo ?? null

        const [dbCheck] = await Promise.all([checkDatabase()])

        const status: HealthCheck['status'] =
          dbCheck.status === 'unhealthy' ? 'unhealthy' : 'healthy'

        const health: HealthCheck = {
          status,
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.0.0',
          checks: {
            database: dbCheck,
            environment: {
              status: 'healthy',
              region,
              cfRay,
            },
          },
        }

        return json(health, { status: status === 'unhealthy' ? 503 : 200 })
      },
    },
  },
})
