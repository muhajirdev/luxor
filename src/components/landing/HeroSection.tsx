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

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.4, 0, 0.2, 1] as const }
  }
}

function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(2)}M`
  } else if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`
  }
  return `$${dollars.toFixed(2)}`
}

interface HeroCollection {
  id: string
  lot: string
  name: string
  creator: string
  image: string
  itemCount: number
  totalValue: number
}

interface HeroSectionProps {
  heroCollection: HeroCollection
  recentSoldItems: string[]
}

export function HeroSection({ heroCollection, recentSoldItems }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroCollection.image}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/95 to-[#000000]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
        <div className="noise-overlay" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-12 items-center gap-12 py-12 lg:py-0">
          {/* Left Content - Editorial Typography */}
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Issue Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="issue-badge">
                Issue 01 · February 2026
              </div>
            </motion.div>

            {/* Editorial Details */}
            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-4">
              <span className="lot-number-lg">LOT {heroCollection.lot}</span>
              <div className="h-px w-12 bg-[#2a2a2a]" />
              <span className="date-stamp">FEATURED COLLECTION</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="headline-xl text-[#fafaf9] mb-8"
            >
              {heroCollection.name.split(' ').slice(0, 2).join(' ')}
              <br />
              <span className="font-display italic font-light">
                {heroCollection.name.split(' ').slice(2).join(' ') || 'Collection'}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="body-xl text-[#b0b0b0] max-w-xl mb-12"
            >
              Premium collectible from {heroCollection.creator}. 
              Join {heroCollection.itemCount} other collectors bidding on this exceptional piece. 
              Authenticated and ready for your collection.
            </motion.p>

            {/* Stats - Editorial Style */}
            <motion.div variants={fadeInUp} className="mb-12">
              <div className="flex gap-8 lg:gap-12 max-w-xl">
                <div className="border-l border-[#2a2a2a] pl-6">
                  <div className="label-sm text-[#4a4a4a] mb-2">Starting Price</div>
                  <div className="font-display text-3xl lg:text-4xl font-semibold text-[#fafaf9] tabular">
                    {formatPrice(heroCollection.totalValue)}
                  </div>
                </div>
                <div className="border-l border-[#2a2a2a] pl-6">
                  <div className="label-sm text-[#4a4a4a] mb-2">Active Bids</div>
                  <div className="font-display text-3xl lg:text-4xl font-semibold text-[#fafaf9] tabular">
                    {heroCollection.itemCount}
                  </div>
                </div>
                <div className="border-l border-[#2a2a2a] pl-6">
                  <div className="label-sm text-[#4a4a4a] mb-2">Seller</div>
                  <div className="font-display text-3xl lg:text-4xl font-semibold text-[#fafaf9] tabular">
                    Verified
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link
                to="/collections"
                className="btn-primary group"
              >
                Place Bid
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/collections"
                className="btn-secondary"
              >
                View Full Catalog
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Featured Item Image */}
          <motion.div
            className="lg:col-span-5 relative"
            initial="hidden"
            animate="visible"
            variants={scaleIn}
          >
            <div className="editorial-frame">
              <div className="editorial-frame-inner aspect-[4/5]">
                <img
                  src={heroCollection.image}
                  alt={heroCollection.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="label-sm text-[#b87333] mb-2">Featured Collection</div>
                      <div className="font-display text-xl text-[#fafaf9]">{heroCollection.creator}</div>
                    </div>
                    <div className="text-right">
                      <div className="label-sm text-[#4a4a4a]">Est. Value</div>
                      <div className="font-display text-2xl text-[#fafaf9] tabular">
                        {formatPrice(heroCollection.totalValue)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 lg:-right-8 z-10">
              <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="label-sm text-green-500">Live Auction</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#000000]/80 backdrop-blur-sm py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex items-center gap-8 overflow-hidden">
            <span className="label-sm text-[#4a4a4a] whitespace-nowrap">Recently Sold:</span>
            <div className="flex gap-12 animate-marquee">
              {recentSoldItems.map((item) => (
                <span key={item} className="label text-[#8a8a8a] whitespace-nowrap">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
