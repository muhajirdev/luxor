import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
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

interface FeaturedCollection {
  id: string
  lot: string
  name: string
  creator: string
  image: string
  itemCount: number
  totalValue: number
}

interface FeaturedGridProps {
  featuredCollections: FeaturedCollection[]
}

export function FeaturedGrid({ featuredCollections }: FeaturedGridProps) {
  return (
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
                    loading="lazy"
                    decoding="async"
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
                        <div className="label-sm text-[#4a4a4a]">Bids</div>
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
                      loading="lazy"
                      decoding="async"
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
                        <span className="label-sm text-[#8a8a8a]">{collection.itemCount} bids</span>
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
  )
}
