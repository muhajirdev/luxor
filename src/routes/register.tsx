import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/lib/auth/AuthContext'
import { signUpUser } from '@/lib/server/auth.server'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
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

function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signUpUser({ data: formData })

      if (result.success) {
        // Update auth context with user data
        if (result.user) {
          setUser(result.user)
        }
        navigate({ to: '/collections' })
      } else {
        setError(result.error || 'Failed to create account')
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
                New Member
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-4">
              <span className="lot-number-lg">JOIN</span>
              <div className="h-px w-12 bg-[#2a2a2a]" />
              <span className="date-stamp">FREE ACCESS</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="headline-xl text-[#fafaf9] mb-8"
            >
              Begin Your
              <br />
              <span className="font-display italic font-light">Collection</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="body-xl text-[#b0b0b0] max-w-md mb-12"
            >
              Create your free account and join a community of serious collectors. 
              Discover rare items, place bids, and build your curated collection.
            </motion.p>

            {/* Benefits */}
            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                'Access to 100+ curated collections',
                'Real-time bidding notifications',
                'Verified seller profiles',
                'Secure payment processing',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-6 w-6 flex items-center justify-center border border-[#b87333]">
                    <svg
                      className="h-3 w-3 text-[#b87333]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="body-sm text-[#8a8a8a]">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Registration Form */}
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
                    <div className="section-marker mb-4">Create Account</div>
                    <h2 className="headline-md text-[#fafaf9]">
                      Get Started
                    </h2>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10">
                      <p className="body-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="label-sm text-[#8a8a8a]">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a4a]" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-4 pl-12 pr-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

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
                          placeholder="Create a strong password"
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
                      <p className="label-sm text-[#4a4a4a]">
                        Must be at least 8 characters
                      </p>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.agreeTerms}
                        onChange={(e) =>
                          setFormData({ ...formData, agreeTerms: e.target.checked })
                        }
                        className="mt-1 w-4 h-4 border border-[#1a1a1a] bg-[#0a0a0a] rounded-none appearance-none checked:bg-[#b87333] checked:border-[#b87333] transition-colors cursor-pointer"
                        required
                      />
                      <label htmlFor="terms" className="cursor-pointer">
                        <span className="body-sm text-[#8a8a8a]">
                          I agree to the{' '}
                          <Link
                            to="/terms"
                            className="text-[#b87333] hover:text-[#fafaf9] transition-colors"
                          >
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link
                            to="/privacy"
                            className="text-[#b87333] hover:text-[#fafaf9] transition-colors"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          Creating Account...
                          <span className="ml-2 inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#fafaf9] border-t-transparent" />
                        </>
                      ) : (
                        <>
                          Create Account
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

                  {/* Sign In Link */}
                  <p className="mt-8 text-center">
                    <span className="body-sm text-[#8a8a8a]">
                      Already have an account?{' '}
                    </span>
                    <Link
                      to="/login"
                      className="body-sm text-[#b87333] hover:text-[#fafaf9] transition-colors"
                    >
                      Sign in
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

export default RegisterPage
