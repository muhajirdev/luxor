import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { createSession, validateSession, destroySession } from '@/lib/auth/session'
import { setSessionToken, clearSessionToken, getSessionToken } from '@/lib/auth/cookie'
import { z } from 'zod'

// Validation schemas
const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const signUpUser = createServerFn({ method: 'POST' })
  .inputValidator(signUpSchema)
  .handler(async ({ data }) => {
    try {
      // Validate input
      const parsed = signUpSchema.parse(data)
      
      // Check if email already exists
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, parsed.email))
        .limit(1)
      
      if (existingUser.length > 0) {
        return { success: false, error: 'An account with this email already exists' }
      }
      
      // Hash password
      const passwordHash = await hashPassword(parsed.password)
      
      // Create user
      const [newUser] = await db.insert(users).values({
        name: parsed.name,
        email: parsed.email,
        passwordHash,
      }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      
      // Create session
      const { token } = await createSession(newUser.id)
      setSessionToken(token)
      
      return { 
        success: true, 
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        }
      }
    } catch (error: unknown) {
      console.error('Sign up error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  })

export const signInUser = createServerFn({ method: 'POST' })
  .inputValidator(signInSchema)
  .handler(async ({ data }) => {
    try {
      // Validate input
      const parsed = data
      
      // Find user by email
      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          passwordHash: users.passwordHash,
        })
        .from(users)
        .where(eq(users.email, parsed.email))
        .limit(1)
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' }
      }
      
      // Verify password
      const isValidPassword = await verifyPassword(parsed.password, user.passwordHash)
      
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' }
      }
      
      // Create session
      const { token } = await createSession(user.id)
      setSessionToken(token)
      
      return { 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
    } catch (error: unknown) {
      console.error('Sign in error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  })

export const signOutUser = createServerFn({ method: 'POST' })
  .handler(async () => {
    try {
      const token = getSessionToken()
      if (token) {
        await destroySession(token)
      }
      clearSessionToken()
      return { success: true }
    } catch (error: unknown) {
      console.error('Sign out error:', error)
      return { success: false, error: 'Failed to sign out' }
    }
  })

export const getCurrentUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const token = getSessionToken()
      if (!token) {
        return { success: true, user: null }
      }
      
      const user = await validateSession(token)
      
      if (!user) {
        clearSessionToken()
        return { success: true, user: null }
      }
      
      return { 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
    } catch (error: unknown) {
      console.error('Get current user error:', error)
      return { success: false, user: null, error: 'Failed to get user' }
    }
  })
