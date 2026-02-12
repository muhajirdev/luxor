import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { signInUser } from '@/lib/server/auth.server'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signInUser({ data: formData })

      if (result.success) {
        navigate({ to: '/app' })
      } else {
        setError(result.error || 'Failed to sign in')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] relative">
      <Header />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#000000] to-[#000000]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b87333]/5 rounded-full blur-[150px]" />
        <div className="noise-overlay" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 items-center gap-12 pt-20">
          {/* Left Content - Editorial Typography */}
          <motion.div
            className="hidden lg:block"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="issue-badge">
                Member Login
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-4">
              <span className="lot-number-lg">ACCESS</span>
              <div className="h-px w-12 bg-[#2a2a2a]" />
              <span className="date-stamp">SECURE LOGIN</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="headline-xl text-[#fafaf9] mb-8"
            >
              Welcome
              <br />
              <span className="font-display italic font-light">Back</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="body-xl text-[#b0b0b0] max-w-md mb-12"
            >
              Sign in to access your collections, track your bids, and discover 
              extraordinary items curated for serious collectors.
            </motion.p>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="flex gap-8">
              <div className="border-l border-[#2a2a2a] pl-6">
                <div className="label-sm text-[#4a4a4a] mb-2">Active Users</div>
                <div className="font-display text-3xl font-semibold text-[#fafaf9] tabular">2,847</div>
              </div>
              <div className="border-l border-[#2a2a2a] pl-6">
                <div className="label-sm text-[#4a4a4a] mb-2">Items Sold</div>
                <div className="font-display text-3xl font-semibold text-[#fafaf9] tabular">12.4k</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <div className="editorial-frame">
                <div className="editorial-frame-inner p-8 lg:p-12">
                  {/* Form Header */}
                  <div className="mb-8">
                    <div className="section-marker mb-4">Member Access</div>
                    <h2 className="headline-md text-[#fafaf9]">
                      Sign In
                    </h2>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10">
                      <p className="body-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="label-sm text-[#8a8a8a]">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a4a]" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-4 pl-12 pr-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="label-sm text-[#8a8a8a]">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a4a]" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          placeholder="Enter your password"
                          className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-4 pl-12 pr-12 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4a4a] transition-colors hover:text-[#8a8a8a]"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 border border-[#1a1a1a] bg-[#0a0a0a] rounded-none appearance-none checked:bg-[#b87333] checked:border-[#b87333] transition-colors cursor-pointer"
                        />
                        <span className="label-sm text-[#8a8a8a] group-hover:text-[#fafaf9] transition-colors">
                          Remember me
                        </span>
                      </label>
                    <button
                      type="button"
                      onClick={() => alert('Forgot password feature is not implemented yet. Please contact admin for assistance.')}
                      className="label-sm text-[#b87333] hover:text-[#fafaf9] transition-colors bg-transparent border-none cursor-pointer p-0"
                    >
                      Forgot password?
                    </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          Signing In...
                          <span className="ml-2 inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#fafaf9] border-t-transparent" />
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#1a1a1a]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#0a0a0a] px-4 label-sm text-[#4a4a4a]">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border border-[#1a1a1a] bg-[#0a0a0a] py-4 font-editorial text-sm text-[#fafaf9] transition-all duration-300 hover:border-[#b87333] hover:bg-[#1a1a1a]"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>

                  {/* Sign Up Link */}
                  <p className="mt-8 text-center">
                    <span className="body-sm text-[#8a8a8a]">
                      Don't have an account?{' '}
                    </span>
                    <Link
                      to="/register"
                      className="body-sm text-[#b87333] hover:text-[#fafaf9] transition-colors"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
