import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Box, Clock, DollarSign, Gavel, Package, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { getCurrentUser } from '@/lib/server/auth.server'
import { getUserBidsServer, getUserCollectionsServer } from '@/lib/server/portfolio.server'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
  loader: async () => {
    // Check if user is authenticated
    const userResult = await getCurrentUser()
    if (!userResult.success || !userResult.user) {
      throw redirect({ to: '/login', search: { redirect: '/portfolio' } })
    }

    const [collectionsResult, bidsResult] = await Promise.all([
      getUserCollectionsServer(),
      getUserBidsServer(),
    ])

    return {
      user: userResult.user,
      collections: collectionsResult.success ? collectionsResult.collections : [],
      bids: bidsResult.success ? bidsResult.bids : [],
      error: !collectionsResult.success ? collectionsResult.error : !bidsResult.success ? bidsResult.error : null,
    }
  },
})

function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(2)}M`
  } else if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`
  }
  return `$${dollars.toFixed(2)}`
}

function formatTimeLeft(endsAt: Date | null): string {
  if (!endsAt) return 'Ongoing'
  const now = new Date()
  const diff = endsAt.getTime() - now.getTime()
  
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'text-emerald-400 bg-emerald-400/10'
    case 'sold':
      return 'text-amber-400 bg-amber-400/10'
    case 'pending':
      return 'text-blue-400 bg-blue-400/10'
    case 'accepted':
      return 'text-emerald-400 bg-emerald-400/10'
    case 'rejected':
      return 'text-red-400 bg-red-400/10'
    case 'cancelled':
      return 'text-slate-400 bg-slate-400/10'
    default:
      return 'text-slate-400 bg-slate-400/10'
  }
}

const ITEMS_PER_PAGE = 5

function PortfolioPage() {
  const { collections, bids, error } = Route.useLoaderData()
  const [visibleCollections, setVisibleCollections] = useState(ITEMS_PER_PAGE)
  const [visibleBids, setVisibleBids] = useState(ITEMS_PER_PAGE)

  // Calculate stats
  const activeListings = collections.filter(c => c.status === 'active').length
  const soldItems = collections.filter(c => c.status === 'sold').length
  const activeBids = bids.filter(b => b.status === 'pending').length
  const totalBidsValue = bids.reduce((sum, b) => sum + b.amount, 0)

  const displayedCollections = collections.slice(0, visibleCollections)
  const displayedBids = bids.slice(0, visibleBids)
  const hasMoreCollections = visibleCollections < collections.length
  const hasMoreBids = visibleBids < bids.length

  const handleLoadMoreCollections = () => {
    setVisibleCollections(prev => prev + ITEMS_PER_PAGE)
  }

  const handleLoadMoreBids = () => {
    setVisibleBids(prev => prev + ITEMS_PER_PAGE)
  }

  return (
    <div className="min-h-screen bg-[#000000] relative">
      <Header />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#000000] to-[#000000]" />
        <div className="noise-overlay" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 pb-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <div className="section-marker mb-4">Portfolio</div>
          <h1 className="headline-xl text-[#fafaf9] mb-4">
            My
            <span className="font-display italic font-light"> Portfolio</span>
          </h1>
          <p className="body-xl text-[#8a8a8a] max-w-2xl">
            Track your collections and active bids. Manage your listings and monitor auction performance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="label-sm text-[#8a8a8a]">Active Listings</span>
            </div>
            <div className="headline-lg text-[#fafaf9]">{activeListings}</div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500/10 flex items-center justify-center">
                <Box className="w-5 h-5 text-amber-400" />
              </div>
              <span className="label-sm text-[#8a8a8a]">Sold Items</span>
            </div>
            <div className="headline-lg text-[#fafaf9]">{soldItems}</div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-blue-400" />
              </div>
              <span className="label-sm text-[#8a8a8a]">Active Bids</span>
            </div>
            <div className="headline-lg text-[#fafaf9]">{activeBids}</div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <span className="label-sm text-[#8a8a8a]">Total Bid Value</span>
            </div>
            <div className="headline-lg text-[#fafaf9]">{formatPrice(totalBidsValue)}</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* My Collections */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="headline-sm text-[#fafaf9]">My Collections</h2>
              <Link
                to="/collections"
                search={{ mine: true }}
                className="btn-secondary text-xs sm:text-sm whitespace-nowrap"
                title="Manage collections"
              >
                Manage
              </Link>
            </div>

            {collections.length === 0 ? (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                  <Package className="w-7 h-7 sm:w-8 sm:h-8 text-[#8a8a8a]" />
                </div>
                <p className="body-lg text-[#8a8a8a] mb-2">No collections yet</p>
                <p className="body-sm text-[#6a6a6a] mb-6">Start selling by creating your first collection</p>
                <Link to="/collections" className="btn-primary text-sm">
                  Browse Collections
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="group bg-[#0a0a0a] border border-[#1a1a1a] p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
                  >
                    <div className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0 overflow-hidden">
                      <img
                        src={collection.imageUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-editorial text-base sm:text-lg text-[#fafaf9] truncate">
                          {collection.name}
                        </h3>
                        <span className={`label-sm px-2 py-1 flex-shrink-0 ${getStatusColor(collection.status)}`}>
                          {collection.status}
                        </span>
                      </div>
                      <p className="body-sm text-[#8a8a8a] line-clamp-1 mb-2">
                        {collection.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-[#6a6a6a]">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          {collection.bidCount} bids
                        </span>
                        <span className="text-[#6a6a6a]">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          {formatPrice(collection.currentBid)}
                        </span>
                        {collection.endsAt && (
                          <span className="text-[#6a6a6a]">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {formatTimeLeft(collection.endsAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {hasMoreCollections && (
                  <button
                    type="button"
                    onClick={handleLoadMoreCollections}
                    className="w-full py-3 px-4 border border-[#2a2a2a] text-[#8a8a8a] hover:text-[#fafaf9] hover:border-[#3a3a3a] transition-colors text-sm sm:text-base"
                  >
                    Load More ({collections.length - visibleCollections} remaining)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* My Bids */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="headline-sm text-[#fafaf9]">My Bids</h2>
              <Link
                to="/collections"
                className="label text-[#8a8a8a] hover:text-[#fafaf9] transition-colors whitespace-nowrap"
              >
                Browse →
              </Link>
            </div>

            {bids.length === 0 ? (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                  <Gavel className="w-7 h-7 sm:w-8 sm:h-8 text-[#8a8a8a]" />
                </div>
                <p className="body-lg text-[#8a8a8a] mb-2">No active bids</p>
                <p className="body-sm text-[#6a6a6a] mb-6">Discover collections and place your first bid</p>
                <Link to="/collections" className="btn-primary text-sm">
                  Browse Collections
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="group bg-[#0a0a0a] border border-[#1a1a1a] p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
                  >
                    <div className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0 overflow-hidden">
                      <img
                        src={bid.collection.imageUrl}
                        alt={bid.collection.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-editorial text-base sm:text-lg text-[#fafaf9] truncate">
                          {bid.collection.name}
                        </h3>
                        <span className={`label-sm px-2 py-1 flex-shrink-0 ${getStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                      </div>
                      <p className="body-sm text-[#8a8a8a] mb-2">
                        Seller: {bid.ownerName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-[#b87333] font-medium">
                          Your bid: {formatPrice(bid.amount)}
                        </span>
                        <span className="text-[#6a6a6a]">
                          Current: {formatPrice(bid.collection.currentBid)}
                        </span>
                        {bid.collection.endsAt && (
                          <span className="text-[#6a6a6a]">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {formatTimeLeft(bid.collection.endsAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {hasMoreBids && (
                  <button
                    type="button"
                    onClick={handleLoadMoreBids}
                    className="w-full py-3 px-4 border border-[#2a2a2a] text-[#8a8a8a] hover:text-[#fafaf9] hover:border-[#3a3a3a] transition-colors text-sm sm:text-base"
                  >
                    Load More ({bids.length - visibleBids} remaining)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage
