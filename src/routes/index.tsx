import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import {
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Zap,
} from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// Mock data for trending collections - editorial styling
const trendingCollections = [
  {
    id: 1,
    lot: '042',
    name: '1959 Gibson Les Paul Standard',
    seller: 'Vintage Guitars Co.',
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=600&fit=crop',
    startingPrice: 1500000,
    currentBid: 2450000,
    bidCount: 12,
    timeLeft: '2d 4h',
    status: 'active',
    category: 'Instruments',
  },
  {
    id: 2,
    lot: '043',
    name: 'Rolex Submariner 1967',
    seller: 'Timepiece Treasury',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop',
    startingPrice: 1200000,
    currentBid: 1850000,
    bidCount: 8,
    timeLeft: '5d 12h',
    status: 'active',
    category: 'Timepieces',
  },
  {
    id: 3,
    lot: '044',
    name: 'Original Banksy "Girl with Balloon"',
    seller: 'Modern Art Vault',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop',
    startingPrice: 8000000,
    currentBid: 12000000,
    bidCount: 3,
    timeLeft: '1d 8h',
    status: 'active',
    category: 'Fine Art',
  },
  {
    id: 4,
    lot: '045',
    name: 'First Edition Harry Potter Set',
    seller: 'Rare Books Exchange',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
    startingPrice: 250000,
    currentBid: 450000,
    bidCount: 23,
    timeLeft: '3d 2h',
    status: 'active',
    category: 'Rare Books',
  },
  {
    id: 5,
    lot: '046',
    name: 'Vintage Leica M3 Camera',
    seller: 'Classic Optics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
    startingPrice: 180000,
    currentBid: 320000,
    bidCount: 15,
    timeLeft: '4d 6h',
    status: 'active',
    category: 'Photography',
  },
]

const featuredCollections = [
  {
    id: 1,
    lot: '038',
    name: 'Estate Jewelry Collection',
    creator: 'Luxury Estate Sales',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=900&fit=crop',
    itemCount: 47,
    totalValue: 850000,
    featured: true,
  },
  {
    id: 2,
    lot: '039',
    name: 'Mid-Century Modern Furniture',
    creator: 'Design Heritage',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop',
    itemCount: 23,
    totalValue: 420000,
    featured: false,
  },
  {
    id: 3,
    lot: '040',
    name: 'Vintage Vinyl Records',
    creator: 'Spin City Archives',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&h=450&fit=crop',
    itemCount: 156,
    totalValue: 180000,
    featured: false,
  },
  {
    id: 4,
    lot: '041',
    name: 'Classic Car Memorabilia',
    creator: 'Automotive History',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=450&fit=crop',
    itemCount: 34,
    totalValue: 290000,
    featured: false,
  },
]

function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(2)}M`
  } else if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`
  }
  return `$${dollars.toFixed(2)}`
}

// Animation variants with proper typing
import type { Variants } from 'framer-motion'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
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
    transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
  }
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] relative">
      <Header />

      {/* HERO SECTION - Editorial Spread */}
      <section className="relative min-h-screen pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=1920&h=1080&fit=crop')`,
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
                <span className="lot-number-lg">LOT 001</span>
                <div className="h-px w-12 bg-[#2a2a2a]" />
                <span className="date-stamp">CLOSING IN 2D 14H</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                variants={fadeInUp}
                className="headline-xl text-[#fafaf9] mb-8"
              >
                1954 Fender
                <br />
                <span className="font-display italic font-light">Stratocaster</span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                variants={fadeInUp}
                className="body-xl text-[#b0b0b0] max-w-xl mb-12"
              >
                An all-original 1954 Fender Stratocaster in sunburst finish. 
                Serial number 0123. Includes original case and documentation. 
                One of the most sought-after vintage guitars in existence.
              </motion.p>

              {/* Stats - Editorial Style */}
              <motion.div variants={fadeInUp} className="mb-12">
                <div className="grid grid-cols-3 gap-8 max-w-lg">
                  <div className="border-l border-[#2a2a2a] pl-6">
                    <div className="label-sm text-[#4a4a4a] mb-2">Current Bid</div>
                    <div className="font-display text-3xl lg:text-4xl font-semibold text-[#fafaf9] tabular">$125,000</div>
                  </div>
                  <div className="border-l border-[#2a2a2a] pl-6">
                    <div className="label-sm text-[#4a4a4a] mb-2">Bids</div>
                    <div className="font-display text-3xl lg:text-4xl font-semibold text-[#fafaf9] tabular">18</div>
                  </div>
                  <div className="border-l border-[#2a2a2a] pl-6">
                    <div className="label-sm text-[#4a4a4a] mb-2">Watchers</div>
                    <div className="font-display text-3xl lg:text-4xl font-semibold text-[#fafaf9] tabular">247</div>
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
                    src="https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=1000&fit=crop"
                    alt="1954 Fender Stratocaster"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="label-sm text-[#b87333] mb-2">Featured Item</div>
                        <div className="font-display text-xl text-[#fafaf9]">Vintage Instruments</div>
                      </div>
                      <div className="text-right">
                        <div className="label-sm text-[#4a4a4a]">Est. Value</div>
                        <div className="font-display text-2xl text-[#fafaf9] tabular">$150k</div>
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
                {['1957 Gibson Les Paul — $89,500', 'Patek Philippe 5711 — $245,000', 'Banksy "Love is in the Bin" — $18.5M', 'First Edition Watchmen — $12,400'].map((item) => (
                  <span key={item} className="label text-[#8a8a8a] whitespace-nowrap">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURED COLLECTIONS - Editorial Magazine Grid */}
      <section className="relative py-24 lg:py-32">
        <div className="noise-overlay" />
        
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeInUp} className="section-marker mb-6">
              From The Collection
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex items-end justify-between">
              <h2 className="headline-lg text-[#fafaf9]">
                Featured
                <span className="font-display italic font-light"> Collections</span>
              </h2>
              
              <Link
                to="/collections"
                className="hidden md:flex items-center gap-2 label text-[#8a8a8a] transition-colors hover:text-[#fafaf9]"
              >
                View Full Catalog
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Featured Item */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="lg:col-span-7 lg:row-span-2"
            >
              <Link 
                to="/collections" 
                className="group block relative h-full"
              >
                <div className="editorial-frame h-full">
                  <div className="editorial-frame-inner aspect-[4/3] lg:aspect-auto lg:h-full relative overflow-hidden"
                  >
                    <img
                      src={featuredCollections[0].image}
                      alt={featuredCollections[0].name}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                    
                    <div className="absolute top-6 left-6">
                      <div className="lot-number">LOT {featuredCollections[0].lot}</div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="label-sm text-[#b87333] mb-2">{featuredCollections[0].creator}</div>
                      <h3 className="font-display text-3xl lg:text-4xl font-semibold text-[#fafaf9] mb-4">
                        {featuredCollections[0].name}
                      </h3>
                      
                      <div className="flex items-center gap-8">
                        <div>
                          <div className="label-sm text-[#4a4a4a]">Items</div>
                          <div className="font-display text-xl text-[#fafaf9]">{featuredCollections[0].itemCount}</div>
                        </div>
                        <div>
                          <div className="label-sm text-[#4a4a4a]">Est. Value</div>
                          <div className="font-display text-xl text-[#fafaf9] tabular">{formatPrice(featuredCollections[0].totalValue)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Smaller Grid Items */}
            {featuredCollections.slice(1).map((collection, index) => (
              <motion.div
                key={collection.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
                transition={{ delay: index * 0.1 }}
                className="lg:col-span-5"
              >
                <Link 
                  to="/collections"
                  className="group block relative"
                >
                  <div className="editorial-frame">
                    <div className="editorial-frame-inner aspect-[16/10] relative overflow-hidden"
                    >
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <div className="lot-number-sm">LOT {collection.lot}</div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="label-sm text-[#b87333] mb-1">{collection.creator}</div>
                        <h3 className="font-display text-xl font-semibold text-[#fafaf9] mb-2">
                          {collection.name}
                        </h3>
                        
                        <div className="flex items-center gap-4">
                          <span className="label-sm text-[#8a8a8a]">{collection.itemCount} items</span>
                          <span className="text-[#4a4a4a]">·</span>
                          <span className="label-sm text-[#fafaf9] tabular">{formatPrice(collection.totalValue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile View All Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center md:hidden"
          >
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 label text-[#8a8a8a]"
            >
              View Full Catalog
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TRENDING SECTION - Editorial List */}
      <section className="relative py-24 lg:py-32 border-t border-[#1a1a1a]">
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeInUp} className="section-marker mb-6">
              Current Auctions
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="headline-md text-[#fafaf9]">
                  Trending
                  <span className="font-display italic font-light"> Lots</span>
                </h2>
                <p className="body-md text-[#8a8a8a] mt-4 max-w-lg">
                  Curated selection of the week's most sought-after collectibles. 
                  Each item verified, authenticated, and ready for your collection.
                </p>
              </div>
              
              <div className="flex gap-2">
                {['24h', '7d', '30d'].map((period) => (
                  <button
                    key={period}
                    className="px-4 py-2 border border-[#1a1a1a] label-sm text-[#8a8a8a] transition-all hover:border-[#b87333] hover:text-[#fafaf9]"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Editorial Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-[#1a1a1a] bg-[#0a0a0a]"
          >
            <div className="overflow-x-auto">
              <table className="editorial-table w-full">
                <thead>
                  <tr>
                    <th className="w-20">Lot</th>
                    <th>Item</th>
                    <th className="text-right">Category</th>
                    <th className="text-right">Starting</th>
                    <th className="text-right">Current Bid</th>
                    <th className="text-right">Bids</th>
                    <th>Seller</th>
                    <th className="text-right">Time</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingCollections.map((collection, index) => (
                    <motion.tr
                      key={collection.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <td className="text-center">
                        <span className="lot-number">{collection.lot}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 overflow-hidden border border-[#1a1a1a]">
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <div className="font-display text-lg text-[#fafaf9]">{collection.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="label-sm text-[#8a8a8a]">{collection.category}</span>
                      </td>
                      <td className="text-right">
                        <span className="price-starting tabular">{formatPrice(collection.startingPrice)}</span>
                      </td>
                      <td className="text-right">
                        <span className="price-current tabular">{formatPrice(collection.currentBid)}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <BarChart3 className="h-4 w-4 text-[#4a4a4a]" />
                          <span className="font-mono text-sm text-[#b0b0b0] tabular">{collection.bidCount}</span>
                        </div>
                      </td>
                      <td>
                        <span className="body-sm text-[#8a8a8a]">{collection.seller}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2 text-[#b87333]">
                          <Clock className="h-4 w-4" />
                          <span className="font-mono text-sm tabular">{collection.timeLeft}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="status-badge status-live">
                          {collection.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/collections"
              className="btn-secondary group"
            >
              Browse Complete Catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION - Editorial Spread */}
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
            {[
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
            ].map((feature, index) => (
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

      {/* CTA SECTION - Dramatic Closing */}
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

      {/* FOOTER - Magazine Masthead Style */}
      <footer className="relative border-t border-[#1a1a1a] bg-[#000000]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          {/* Top Section */}
          <div className="py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Brand Column */}
              <div className="lg:col-span-5">
                <Link to="/" className="flex items-center gap-4 mb-6"
                >
                  <div className="flex h-14 w-14 items-center justify-center border border-[#2a2a2a] bg-[#0a0a0a]"
                  >
                    <span className="font-display text-2xl font-bold text-[#fafaf9]">L</span>
                  </div>
                  <div>
                    <span className="font-display text-2xl font-semibold text-[#fafaf9]">
                      Luxor
                    </span>
                    <span className="font-display text-2xl font-light italic text-[#b87333] ml-1">
                      Bids
                    </span>
                  </div>
                </Link>

                <p className="body-md text-[#8a8a8a] max-w-sm mb-8"
                >
                  Premium marketplace for physical collectibles. Estate sales, vintage 
                  items, art, and rare finds. Where serious collectors bid with confidence.
                </p>

                <div className="flex gap-6"
                >
                  {['Twitter', 'Discord', 'Instagram'].map((social) => (
                    <span
                      key={social}
                      className="label text-[#4a4a4a] transition-colors hover:text-[#b87333] cursor-pointer"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links Columns */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8"
                >
                  {[
                    {
                      title: 'Marketplace',
                      links: ['Browse Catalog', 'Trending', 'New Arrivals', 'Auctions'],
                    },
                    {
                      title: 'Company',
                      links: ['About', 'How It Works', 'Pricing', 'Press'],
                    },
                    {
                      title: 'Support',
                      links: ['Help Center', 'Contact', 'Trust & Safety', 'Terms'],
                    },
                  ].map((section) => (
                    <div key={section.title}
                    >
                      <h3 className="label text-[#4a4a4a] mb-6"
                      >
                        {section.title}
                      </h3>
                      
                      <ul className="space-y-3"
                      >
                        {section.links.map((link) => (
                          <li key={link}
                          >
                            <span className="body-sm text-[#8a8a8a] transition-colors hover:text-[#fafaf9] cursor-pointer"
                            >
                              {link}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#1a1a1a] py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <p className="label-sm text-[#4a4a4a]"
              >
                © {new Date().getFullYear()} Luxor Bids. All rights reserved.
              </p>

              <div className="flex items-center gap-8"
              >
                <span className="label-sm text-[#4a4a4a] cursor-pointer hover:text-[#8a8a8a]"
                >
                  Privacy Policy
                </span>
                <span className="label-sm text-[#4a4a4a] cursor-pointer hover:text-[#8a8a8a]"
                >
                  Terms of Service
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
