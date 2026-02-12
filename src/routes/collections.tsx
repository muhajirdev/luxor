import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { getCollectionsListServer } from '@/lib/server/collections.server'
import { useState } from 'react'
import {
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  ArrowRight
} from 'lucide-react'

export const Route = createFileRoute('/collections')({
  component: CollectionsPage,
  loader: async () => {
    return await getCollectionsListServer()
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
  const diff = new Date(endsAt).getTime() - now.getTime()
  
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

function CollectionsPage() {
  const data = Route.useLoaderData()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#000000] relative">
      <Header />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#000000] to-[#000000]" />
        <div className="noise-overlay" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12 pt-28 pb-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="section-marker mb-4">Browse Catalog</div>
          <h1 className="headline-xl text-[#fafaf9] mb-4">
            All
            <span className="font-display italic font-light"> Collections</span>
          </h1>
          <p className="body-xl text-[#8a8a8a] max-w-2xl">
            Explore {data.pagination.totalCount} curated collections. Click any item to view bids and place your offer.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a4a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections..."
              className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-4 pl-12 pr-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
            />
          </div>
        </div>

        {/* Collections Table */}
        <div className="border border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="overflow-x-auto">
            <table className="editorial-table w-full">
              <thead>
                <tr>
                  <th className="w-16"></th>
                  <th>Item</th>
                  <th className="text-right">Starting Price</th>
                  <th className="text-right">Current Bid</th>
                  <th className="text-right">Bids</th>
                  <th>Seller</th>
                  <th className="text-right">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.collections.map((collection) => (
                  <>
                    <tr
                      key={collection.id}
                      className="group cursor-pointer"
                      onClick={() => toggleExpand(collection.id)}
                    >
                      <td className="text-center">
                        <button className="p-2 text-[#4a4a4a] transition-colors hover:text-[#b87333]">
                          {expandedId === collection.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 overflow-hidden border border-[#1a1a1a] bg-[#1a1a1a]">
                            <img
                              src={collection.image}
                              alt={collection.name}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-display text-lg text-[#fafaf9]">
                              {collection.name}
                            </div>
                            <div className="lot-number-sm">
                              LOT {collection.lot}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="price-starting tabular">
                          {formatPrice(collection.startingPrice)}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="price-current tabular">
                          {formatPrice(collection.currentBid)}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <BarChart3 className="h-4 w-4 text-[#4a4a4a]" />
                          <span className="font-mono text-sm text-[#b0b0b0] tabular">
                            {collection.bidCount}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="body-sm text-[#8a8a8a]">
                          {collection.seller}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Clock className="h-4 w-4 text-[#b87333]" />
                          <span className="font-mono text-sm text-[#b87333] tabular">
                            {formatTimeLeft(collection.endsAt)}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={`status-badge ${collection.status === 'active' ? 'status-live' : 'status-sold'}`}>
                          {collection.status}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Expanded Bid Details */}
                    {expandedId === collection.id && (
                      <tr className="bg-[#0a0a0a] animate-expandIn">
                        <td colSpan={8} className="p-0">
                          <div className="border-t border-[#1a1a1a]">
                            <div className="p-6 animate-expandContentIn">
                                {/* Nested Bids Table */}
                                <div className="mb-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="label-sm text-[#4a4a4a]">Bid History</h4>
                                    <span className="label-sm text-[#b87333]">{collection.bidCount} bids</span>
                                  </div>
                                  
                                  <div className="border border-[#1a1a1a]">
                                    <table className="w-full">
                                      <thead className="bg-[#000000]">
                                        <tr>
                                          <th className="text-left py-3 px-4 label-sm text-[#4a4a4a]">Rank</th>
                                          <th className="text-left py-3 px-4 label-sm text-[#4a4a4a]">Bidder</th>
                                          <th className="text-right py-3 px-4 label-sm text-[#4a4a4a]">Amount</th>
                                          <th className="text-center py-3 px-4 label-sm text-[#4a4a4a]">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border-t border-[#1a1a1a] bg-[#b87333]/5">
                                          <td className="py-3 px-4">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#b87333] text-xs text-[#000000] font-bold">
                                              1
                                            </span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="body-sm text-[#fafaf9]">Current Highest</span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <span className="font-display text-lg text-[#b87333] tabular">
                                              {formatPrice(collection.currentBid)}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-center">
                                            <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-500">Leading</span>
                                          </td>
                                        </tr>
                                        <tr className="border-t border-[#1a1a1a]">
                                          <td className="py-3 px-4">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1a1a1a] text-xs text-[#4a4a4a]">
                                              S
                                            </span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="body-sm text-[#8a8a8a]">Starting Price</span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <span className="font-mono text-sm text-[#4a4a4a] tabular">
                                              {formatPrice(collection.startingPrice)}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-center">
                                            <span className="inline-block px-2 py-1 text-xs bg-[#1a1a1a] text-[#4a4a4a]">Base</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                
                                {/* Quick Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <span className="label-sm text-[#4a4a4a] block">Next minimum bid</span>
                                      <span className="font-display text-xl text-[#fafaf9] tabular">
                                        {formatPrice(collection.currentBid + 100)}
                                      </span>
                                    </div>
                                    <div className="h-8 w-px bg-[#1a1a1a]" />
                                    <div>
                                      <span className="label-sm text-[#4a4a4a] block">Your max bid</span>
                                      <span className="font-mono text-sm text-[#8a8a8a] tabular">--</span>
                                    </div>
                                  </div>
                                  
                                  <button className="btn-primary group">
                                    Place Bid
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="label-sm text-[#4a4a4a]">
            Showing {data.collections.length} of {data.pagination.totalCount} collections
          </div>
          
          <div className="flex items-center gap-2">
            <button
              disabled={data.pagination.page <= 1}
              className="px-4 py-2 border border-[#1a1a1a] label-sm text-[#8a8a8a] transition-all hover:border-[#b87333] hover:text-[#fafaf9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="label-sm text-[#8a8a8a] px-4">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            
            <button
              disabled={data.pagination.page >= data.pagination.totalPages}
              className="px-4 py-2 border border-[#1a1a1a] label-sm text-[#8a8a8a] transition-all hover:border-[#b87333] hover:text-[#fafaf9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsPage
