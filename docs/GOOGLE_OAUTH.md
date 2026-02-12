# Google OAuth Implementation Guide

**Status:** Not Implemented  
**Priority:** Medium  
**Effort:** 1-2 days

## Overview

This document details the Google OAuth authentication feature that is planned but not yet implemented. The current authentication system uses email/password only. Adding Google OAuth will provide:

- One-click sign in/sign up
- Reduced friction for new users
- Automatic email verification
- Profile photo sync
- Access to user's name from Google profile

## Current Implementation

The app currently has:
- Session-based authentication with JWT tokens
- Email/password registration and login
- Password hashing with bcrypt
- Session tokens stored in HTTP-only cookies

## What Needs to Be Implemented

### 1. Database Schema Changes

**New Table: `oauth_accounts`**

```typescript
export const oauthAccounts = pgTable('oauth_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // 'google'
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

**Update `users` table:**

```typescript
// Add these columns to users table
passwordHash: varchar('password_hash', { length: 255 }), // Make nullable
provider: varchar('provider', { length: 50 }), // 'email', 'google'
isEmailVerified: boolean('is_email_verified').default(false),
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API (or People API)
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain.com`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`, `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret

### 3. Environment Variables

Add to `.env` and `wrangler.toml`:

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

### 4. Server Implementation

#### Install Dependencies

```bash
pnpm add arctic
```

Arctic is a lightweight OAuth library for TypeScript.

#### Create OAuth Utilities

**File:** `src/lib/auth/google.ts`

```typescript
import { generateCodeVerifier, generateState, Google } from 'arctic'

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
)

export { google, generateCodeVerifier, generateState }
```

#### Server Functions

**File:** `src/lib/server/oauth.server.ts`

```typescript
import { createServerFn } from '@tanstack/react-start'
import { generateCodeVerifier, generateState, google } from '@/lib/auth/google'
import { getSessionToken, setSessionToken } from '@/lib/auth/cookie'
import { db } from '@/lib/db'
import { oauthAccounts, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Generate Google OAuth URL
export const getGoogleAuthUrlServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    
    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ['profile', 'email'],
    })
    
    // Store state and codeVerifier in cookies (temporary, 10 minutes)
    // These are used to validate the callback
    
    return {
      url: url.toString(),
      state,
      codeVerifier,
    }
  })

// Handle Google OAuth callback
const googleCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
})

export const handleGoogleCallbackServer = createServerFn({ method: 'POST' })
  .inputValidator(googleCallbackSchema)
  .handler(async ({ data }) => {
    try {
      // Validate state and codeVerifier from cookies
      // (Implementation depends on your cookie handling)
      
      const tokens = await google.validateAuthorizationCode(
        data.code,
        codeVerifierFromCookie
      )
      
      // Fetch user info from Google
      const response = await fetch(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
          },
        }
      )
      
      const googleUser = await response.json()
      
      // Check if user already exists with this Google account
      const [existingOAuth] = await db
        .select()
        .from(oauthAccounts)
        .where(
          and(
            eq(oauthAccounts.provider, 'google'),
            eq(oauthAccounts.providerAccountId, googleUser.sub)
          )
        )
        .limit(1)
      
      let userId: string
      
      if (existingOAuth) {
        // User exists, update tokens
        userId = existingOAuth.userId
        
        await db
          .update(oauthAccounts)
          .set({
            accessToken: tokens.accessToken(),
            refreshToken: tokens.refreshToken(),
            expiresAt: tokens.accessTokenExpiresAt(),
          })
          .where(eq(oauthAccounts.id, existingOAuth.id))
      } else {
        // Check if user exists with same email
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, googleUser.email))
          .limit(1)
        
        if (existingUser) {
          // Link OAuth to existing account
          userId = existingUser.id
          
          await db.insert(oauthAccounts).values({
            userId,
            provider: 'google',
            providerAccountId: googleUser.sub,
            accessToken: tokens.accessToken(),
            refreshToken: tokens.refreshToken(),
            expiresAt: tokens.accessTokenExpiresAt(),
          })
          
          // Mark email as verified
          await db
            .update(users)
            .set({
              isEmailVerified: true,
              avatarUrl: googleUser.picture || existingUser.avatarUrl,
            })
            .where(eq(users.id, userId))
        } else {
          // Create new user
          const [newUser] = await db
            .insert(users)
            .values({
              name: googleUser.name || googleUser.email.split('@')[0],
              email: googleUser.email,
              avatarUrl: googleUser.picture,
              provider: 'google',
              isEmailVerified: true,
            })
            .returning({ id: users.id })
          
          userId = newUser.id
          
          await db.insert(oauthAccounts).values({
            userId,
            provider: 'google',
            providerAccountId: googleUser.sub,
            accessToken: tokens.accessToken(),
            refreshToken: tokens.refreshToken(),
            expiresAt: tokens.accessTokenExpiresAt(),
          })
        }
      }
      
      // Create session
      const sessionToken = generateSessionToken() // Your existing token generation
      await createSession(sessionToken, userId) // Your existing session creation
      
      setSessionToken(sessionToken)
      
      return { success: true }
    } catch (error) {
      console.error('Google OAuth error:', error)
      return { success: false, error: 'Authentication failed' }
    }
  })
```

### 5. UI Implementation

#### Add Google Sign-In Button

**File:** `src/components/auth/GoogleSignInButton.tsx`

```typescript
import { useState } from 'react'
import { getGoogleAuthUrlServer } from '@/lib/server/oauth.server'

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const result = await getGoogleAuthUrlServer()
      
      // Store state and codeVerifier in cookies
      document.cookie = `oauth_state=${result.state}; Path=/; Max-Age=600; SameSite=Lax`
      document.cookie = `oauth_code_verifier=${result.codeVerifier}; Path=/; Max-Age=600; SameSite=Lax`
      
      // Redirect to Google
      window.location.href = result.url
    } catch (error) {
      console.error('Failed to initiate Google OAuth:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#1a1a1a] bg-[#0a0a0a] text-[#fafaf9] hover:bg-[#0f0f0f] transition-colors disabled:opacity-50"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? 'Connecting...' : 'Continue with Google'}
    </button>
  )
}
```

#### Update Login/Register Pages

**File:** `src/routes/login.tsx` and `src/routes/register.tsx`

Add the Google button above or below the existing form:

```typescript
<div className="space-y-4">
  <GoogleSignInButton />
  
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-[#1a1a1a]" />
    </div>
    <div className="relative flex justify-center text-xs">
      <span className="px-2 bg-[#050505] text-[#4a4a4a]">Or continue with email</span>
    </div>
  </div>
  
  {/* Existing email/password form */}
</div>
```

#### Create Callback Route

**File:** `src/routes/api.auth.callback.google.tsx`

```typescript
import { createFileRoute, redirect } from '@tanstack/react-router'
import { handleGoogleCallbackServer } from '@/lib/server/oauth.server'

export const Route = createFileRoute('/api/auth/callback/google')({
  loader: async ({ request }) => {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    if (error) {
      throw redirect({
        to: '/login',
        search: { error: 'google_auth_denied' },
      })
    }
    
    if (!code || !state) {
      throw redirect({
        to: '/login',
        search: { error: 'invalid_callback' },
      })
    }
    
    // Verify state matches (from cookie)
    // This prevents CSRF attacks
    
    const result = await handleGoogleCallbackServer({
      data: { code, state },
    })
    
    if (result.success) {
      throw redirect({ to: '/' })
    } else {
      throw redirect({
        to: '/login',
        search: { error: 'auth_failed' },
      })
    }
  },
})
```

### 6. Migration Steps

1. **Create migration file:**

```bash
pnpm drizzle-kit generate
```

2. **Run migration** (manually, as per project guidelines)

3. **Update existing users:**

```sql
UPDATE users SET provider = 'email', is_email_verified = true WHERE provider IS NULL;
```

### 7. Testing Checklist

- [ ] New user can sign up with Google
- [ ] Existing user can link Google account
- [ ] User with same email can link to existing account
- [ ] OAuth tokens are stored securely
- [ ] Session is created after OAuth
- [ ] User is redirected correctly after auth
- [ ] Error handling works (denied permission, network errors)
- [ ] State validation prevents CSRF
- [ ] Code verifier validation prevents attacks

## Security Considerations

### State Parameter
Always validate the state parameter matches what was sent. This prevents CSRF attacks.

### PKCE (Proof Key for Code Exchange)
The code verifier should be:
- Generated cryptographically random
- Stored securely (HTTP-only cookie)
- Validated on callback
- Single-use only

### Token Storage
- Access tokens can be stored in database
- Consider encrypting tokens at rest
- Never expose tokens to client-side JavaScript

### Session Management
- Use same session mechanism as email/password auth
- Regenerate session ID on OAuth completion
- Set appropriate session expiry

### Privacy
- Only request necessary scopes (`profile`, `email`)
- Don't store Google user ID in client-side code
- Allow users to disconnect OAuth account

## Troubleshooting

### "Redirect URI mismatch"
Ensure the redirect URI in Google Cloud Console exactly matches your app's callback URL (including protocol and trailing slash).

### "Invalid grant"
Usually means the authorization code was already used or expired. Codes are single-use and expire quickly.

### State validation fails
Make sure cookies are being set with proper attributes:
- `SameSite=Lax` or `SameSite=Strict`
- `Secure` in production
- Proper `Path=/`

## Future Enhancements

1. **Multiple OAuth Providers:** Add GitHub, Twitter, etc.
2. **Account Linking UI:** Allow users to connect/disconnect OAuth from profile
3. **Token Refresh:** Automatically refresh expired access tokens
4. **Profile Sync:** Update name/avatar when user changes Google profile
5. **Analytics:** Track OAuth vs email sign-up rates

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Arctic Documentation](https://arcticjs.dev/)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
