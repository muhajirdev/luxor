/**
 * AuthContext - Global Authentication State Management
 *
 * Provides authentication state and actions throughout the React component tree.
 * User data is initialized from the root route loader (SSR) and maintained in React Context.
 *
 * ## Data Flow
 *
 * ```
 * __root.tsx Loader
 *       ↓
 * getCurrentUser() [server function]
 *       ↓
 * AuthProvider [initialUser prop]
 *       ↓
 * useAuth() hook [any component]
 * ```
 *
 * ## Usage
 *
 * The AuthProvider is automatically wrapped around all routes in `__root.tsx`.
 * Child components can access auth state via the `useAuth()` hook:
 *
 * ```tsx
 * import { useAuth } from '@/lib/auth/AuthContext'
 *
 * function Header() {
 *   const { user, signOut } = useAuth()
 *
 *   if (user) {
 *     return <div>Welcome, {user.name} <button onClick={signOut}>Sign Out</button></div>
 *   }
 *   return <Link to="/login">Login</Link>
 * }
 * ```
 *
 * ## Login Flow
 *
 * After successful login/registration, update the auth context:
 *
 * ```tsx
 * function LoginPage() {
 *   const { setUser } = useAuth()
 *   const navigate = useNavigate()
 *
 *   const handleLogin = async () => {
 *     const result = await signInUser({ data: credentials })
 *     if (result.success && result.user) {
 *       setUser(result.user)  // Update context immediately
 *       navigate({ to: '/' })
 *     }
 *   }
 * }
 * ```
 *
 * ## Why This Pattern?
 *
 * 1. **No Client-Side Fetch**: User data comes from root loader (runs server-side)
 *    - No useEffect needed
 *    - No hydration mismatch
 *    - Immediate auth state on page load
 *
 * 2. **Context for UI State**: Auth state changes (login/logout) need to reflect immediately
 *    - signOut() updates context, triggers re-render
 *    - setUser() updates context after login
 *    - Header and other components stay in sync
 *
 * 3. **Server-First Architecture**: TanStack Start convention
 *    - Root loader runs before any component renders
 *    - Auth state available during SSR
 *    - Works with HTTP-only cookies
 *
 * ## Server-Side Auth
 *
 * For protected server functions, use `getCurrentUser()` directly:
 * ```tsx
 * createServerFn({ method: 'POST' })
 *   .handler(async () => {
 *     const result = await getCurrentUser()
 *     if (!result.user) throw new Error('Unauthorized')
 *     // ... proceed with authenticated action
 *   })
 * ```
 */

import { useNavigate } from '@tanstack/react-router'
import { createContext, type ReactNode, useContext, useState } from 'react'
import { signOutUser } from '@/lib/server/auth.server'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  /** Current user or null if not authenticated */
  user: User | null
  /** Sign out the current user and redirect to home */
  signOut: () => Promise<void>
  /** Update the current user (e.g., after login) */
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  /** User data from root route loader (server-side) */
  initialUser: User | null
}

/**
 * AuthProvider - Wraps the app and provides auth state
 * 
 * Initialized with user data from root loader. Updates when signOut is called.
 * Placed in __root.tsx so all routes have access to auth context.
 */
export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const navigate = useNavigate()

  const signOut = async () => {
    await signOutUser()
    setUser(null)
    navigate({ to: '/' })
  }

  return (
    <AuthContext.Provider value={{ user, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth - Hook to access authentication state and actions
 *
 * @throws Error if used outside of AuthProvider
 * @returns {AuthContextType} Current user, signOut function, and setUser function
 *
 * @example
 * ```tsx
 * function UserMenu() {
 *   const { user, signOut } = useAuth()
 *
 *   if (!user) return <Link to="/login">Login</Link>
 *
 *   return (
 *     <div>
 *       <span>{user.name}</span>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * function LoginPage() {
 *   const { setUser } = useAuth()
 *
 *   const handleLogin = async () => {
 *     const result = await signInUser({ data: credentials })
 *     if (result.success && result.user) {
 *       setUser(result.user)
 *       navigate({ to: '/' })
 *     }
 *   }
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
