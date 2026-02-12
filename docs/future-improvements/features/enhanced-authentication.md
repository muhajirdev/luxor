# Enhanced Authentication

**Priority:** High
**Status:** Not Started

## Forgot Password Flow

- Password reset via email
- Secure token-based reset links
- Time-limited reset tokens (1 hour expiry)
- Rate limiting on reset requests

## Google OAuth Integration

- One-click sign in with Google
- Automatic account linking
- Profile photo sync
- Secure OAuth 2.0 flow

## Implementation Notes

- Store reset tokens in separate table with expiry
- Use Resend or SendGrid for transactional emails
- OAuth requires Google Cloud Console setup
- Update users table to support OAuth provider IDs

## New Tables

```typescript
password_resets {
  id: uuid (PK)
  user_id: uuid (FK → users.id)
  token_hash: varchar(255)  // bcrypt hashed token
  expires_at: timestamp
  used: boolean default false
  created_at: timestamp
}

oauth_accounts {
  id: uuid (PK)
  user_id: uuid (FK → users.id)
  provider: varchar(50)  // 'google', 'github', etc.
  provider_account_id: varchar(255)
  access_token: text
  refresh_token: text
  expires_at: timestamp
  created_at: timestamp
}
```

## Auth Security Improvements

### Rate Limiting
- Max 5 login attempts per 15 minutes per IP
- Max 3 password reset requests per hour per email
- Use Redis or in-memory store for rate limiting

### Account Lockout
- Lock account for 30 minutes after 5 failed login attempts
- Email notification when account is locked
- Admin unlock capability

### Session Security
- Session rotation: Issue new token on each request
- Device fingerprinting: Detect unusual login patterns
- Concurrent session limit: Max 3 active sessions per user
- Force logout from all devices option

### Email Verification
- Require email verification before bidding
- Resend verification email capability
- Grace period: Allow browsing but not bidding

### Audit Logging
- Log all auth events (login, logout, password change)
- Store IP address and user agent
- Admin dashboard to view user activity
- Suspicious activity alerts (login from new location)

### Admin Tools
- Force logout specific user
- View active sessions per user
- Disable/enable user accounts
- Password reset for users (admin-initiated)

**Alternative:** Consider managed auth (Clerk, Auth0, etc.) if maintenance becomes burdensome or enterprise features needed.
