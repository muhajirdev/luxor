import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'

const SESSION_COOKIE_NAME = 'session_token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

export function getSessionToken(): string | undefined {
  return getCookie(SESSION_COOKIE_NAME)
}

export function setSessionToken(token: string): void {
  setCookie(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS)
}

export function clearSessionToken(): void {
  deleteCookie(SESSION_COOKIE_NAME)
}
