import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Clock } from 'lucide-react'
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

function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(2)}M`
  } else if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`
  }
  return `$${dollars.toFixed(2)}`
}

interface TrendingCollection {
  id: string
  lot: string
  name: string
  image: string
  category: string
  startingPrice: number
  currentBid: number
  bidCount: number
  seller: string
  timeLeft: string
  status: string
}

interface TrendingTableProps {
  trendingCollections: TrendingCollection[]
}

export function TrendingTable({ trendingCollections }: TrendingTableProps) {
  return (
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
                {trendingCollections.length > 0 ? (
                  trendingCollections.map((collection, index) => (
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
                          <div className="h-14 w-14 overflow-hidden border border-[#1a1a1a] bg-[#1a1a1a]">
                            <img
                              src={collection.image}
                              alt={collection.name}
                              loading="lazy"
                              decoding="async"
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-[#8a8a8a]">
                      No active auctions at the moment. Check back soon!
                    </td>
                  </tr>
                )}
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
  )
}
