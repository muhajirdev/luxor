import { db } from '@/lib/db'
import { sessions, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

const SESSION_EXPIRY_DAYS = 7

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  })

  return { token, expiresAt }
}

export async function validateSession(token: string): Promise<typeof users.$inferSelect | null> {
  if (!token) return null

  const session = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .where(eq(sessions.token, token))
    .leftJoin(users, eq(sessions.userId, users.id))
    .limit(1)

  if (!session.length) return null

  const { session: sess, user } = session[0]

  // Check if session is expired
  if (new Date() > new Date(sess.expiresAt)) {
    await destroySession(token)
    return null
  }

  return user
}

export async function destroySession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token))
}
