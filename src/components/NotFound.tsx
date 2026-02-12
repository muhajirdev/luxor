import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Compass } from 'lucide-react'
import { Header } from '@/components/Header'
import type { Variants } from 'framer-motion'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
  }
}

export function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-[#000000] relative">
      <Header />

      <main className="relative min-h-screen flex items-center justify-center pt-32 lg:pt-40">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#000000]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #b87333 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b87333]/5 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#b87333]/3 rounded-full blur-[96px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[calc(100vh-10rem)]">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              {/* 404 Badge */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="inline-flex items-center gap-3 border border-[#1a1a1a] bg-[#0a0a0a] px-6 py-3">
                  <Compass className="h-5 w-5 text-[#b87333]" />
                  <span className="label text-[#8a8a8a]">Page Not Found</span>
                </div>
              </motion.div>

              {/* Large 404 */}
              <motion.div variants={scaleIn} className="mb-8">
                <span className="font-display text-[120px] sm:text-[160px] lg:text-[200px] font-bold leading-none text-[#fafaf9] tracking-tighter">
                  404
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="headline-xl text-[#fafaf9] mb-6"
              >
                This lot has been
                <br />
                <span className="font-display italic font-light text-[#b87333]">
                  moved or removed
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeInUp}
                className="body-xl text-[#8a8a8a] max-w-lg mx-auto lg:mx-0 mb-12"
              >
                The page you're looking for doesn't exist or has been relocated.
                Explore our current catalog or return to the main auction floor.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/"
                  className="btn-primary group"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  Return to Auction House
                </Link>
                <Link
                  to="/collections"
                  className="btn-secondary"
                >
                  <Search className="h-4 w-4" />
                  Browse Catalog
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Visual Element */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {/* Decorative Frame */}
                <div className="editorial-frame">
                  <div className="editorial-frame-inner aspect-square w-80 xl:w-96 flex items-center justify-center bg-[#0a0a0a]">
                    {/* Compass Icon Animation */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <svg width="280" height="280" viewBox="0 0 280 280" fill="none" className="opacity-10">
                        <circle cx="140" cy="140" r="130" stroke="#b87333" strokeWidth="0.5" />
                        <circle cx="140" cy="140" r="100" stroke="#b87333" strokeWidth="0.5" />
                        <circle cx="140" cy="140" r="70" stroke="#b87333" strokeWidth="0.5" />
                        {[...Array(12)].map((_, i) => (
                          <line
                            key={i}
                            x1="140"
                            y1="10"
                            x2="140"
                            y2="30"
                            stroke="#b87333"
                            strokeWidth="0.5"
                            transform={`rotate(${i * 30} 140 140)`}
                          />
                        ))}
                      </svg>
                    </motion.div>

                    {/* Center Content */}
                    <div className="relative z-10 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-6"
                      >
                        <Compass className="h-16 w-16 text-[#b87333] mx-auto" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                      >
                        <div className="font-display text-2xl text-[#fafaf9] mb-2">Lost?</div>
                        <div className="label-sm text-[#4a4a4a]">Navigate Home</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t border-r border-[#b87333]/30" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b border-l border-[#b87333]/30" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Info */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#000000]/80 backdrop-blur-sm py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="label-sm text-[#4a4a4a]">
                Reference: 404-NOT-FOUND
              </span>
              <div className="flex items-center gap-6">
                <Link to="/contact" className="label text-[#8a8a8a] hover:text-[#fafaf9] transition-colors">
                  Contact Support
                </Link>
                <span className="text-[#2a2a2a]">|</span>
                <Link to="/how-it-works" className="label text-[#8a8a8a] hover:text-[#fafaf9] transition-colors">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
