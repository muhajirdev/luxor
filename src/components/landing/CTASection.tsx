import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
      delayChildren: 0.3
    }
  }
}

export function CTASection() {
  return (
    <section className="relative py-32 lg:py-48 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#000000] to-[#000000]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b87333]/5 rounded-full blur-[200px]" />
        <div className="noise-overlay" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-12 bg-[#b87333]" />
            <span className="label text-[#b87333]">Join The Community</span>
            <div className="h-px w-12 bg-[#b87333]" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="headline-xl text-[#fafaf9] mb-8"
          >
            Ready to Start
            <br />
            <span className="font-display italic font-light">Collecting?</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="body-xl text-[#8a8a8a] max-w-2xl mx-auto mb-12"
          >
            Join thousands of collectors who've discovered extraordinary items
            on Luxor. Create your free account today and start bidding with confidence.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="btn-primary group"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/collections"
              className="btn-secondary"
            >
              Browse Collections
            </Link>
          </motion.div>

          <motion.p variants={fadeInUp} className="mt-8 label-sm text-[#4a4a4a]"
          >
            No credit card required. Free to browse and bid.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
