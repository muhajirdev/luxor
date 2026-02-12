import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Clock, Zap } from 'lucide-react'
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

interface Feature {
  number: string
  icon: typeof TrendingUp
  title: string
  description: string
  stat: string
  statLabel: string
}

const features: Feature[] = [
  {
    number: '01',
    icon: TrendingUp,
    title: 'Verified Sellers',
    description: 'Every seller is identity-verified. No anonymous accounts, no scams.',
    stat: '100%',
    statLabel: 'Verified',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Transparent Bidding',
    description: 'Full bid history on every item. See exactly how auctions progress.',
    stat: '0%',
    statLabel: 'Hidden Fees',
  },
  {
    number: '03',
    icon: Clock,
    title: 'Time-Bound Auctions',
    description: '7-day cycles keep inventory fresh and create healthy urgency.',
    stat: '7d',
    statLabel: 'Auction Cycles',
  },
  {
    number: '04',
    icon: Zap,
    title: '3% Commission',
    description: 'Keep more of your money. Way less than traditional auction houses.',
    stat: '3%',
    statLabel: 'vs 25-30%',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a0a]">
      <div className="noise-overlay" />

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.div variants={fadeInUp} className="section-marker mb-6">
            The Luxor Difference
          </motion.div>

          <motion.div variants={fadeInUp} className="max-w-3xl">
            <h2 className="headline-lg text-[#fafaf9] mb-6">
              Built for
              <span className="font-display italic font-light"> Serious Collectors</span>
            </h2>

            <p className="body-xl text-[#8a8a8a]">
              Everything you need to discover, bid on, and acquire exceptional
              collectibles with confidence and transparency. We've reimagined
              the auction experience for the modern collector.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid - Editorial Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-[#000000] p-8 lg:p-10 group"
            >
              <div className="relative">
                {/* Large Number */}
                <div className="absolute -top-2 -left-2 font-display text-6xl lg:text-7xl font-bold text-[#1a1a1a] opacity-50">
                  {feature.number}
                </div>

                <div className="relative">
                  <div className="w-12 h-12 flex items-center justify-center border border-[#1a1a1a] mb-6 group-hover:border-[#b87333] transition-colors duration-300">
                    <feature.icon className="h-5 w-5 text-[#b87333]" />
                  </div>

                  <div className="mb-6">
                    <div className="font-display text-4xl font-bold text-[#fafaf9] tabular">{feature.stat}</div>
                    <div className="label-sm text-[#b87333] mt-1">{feature.statLabel}</div>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-[#fafaf9] mb-3">
                    {feature.title}
                  </h3>

                  <p className="body-sm text-[#8a8a8a]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
