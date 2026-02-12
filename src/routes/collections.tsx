import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useCallback } from 'react'
import { Header } from '@/components/Header'
import { getCollectionsListServer } from '@/lib/server/collections.server'
import {
  CollectionsProvider,
  SearchBar,
  CollectionTable,
  Pagination,
} from '@/components/collections'

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.number().optional(),
})

export const Route = createFileRoute('/collections')({
  component: CollectionsPage,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const searchQuery = deps.q || ''
    const page = deps.page || 1
    return await getCollectionsListServer({ data: { search: searchQuery, page, limit: 20 } })
  },
})

function CollectionsPage() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const handleSearch = useCallback((query: string) => {
    navigate({
      search: (prev) => ({ ...prev, q: query || undefined }),
    })
  }, [navigate])

  return (
    <CollectionsProvider data={data} initialSearch={search.q || ''} onSearch={handleSearch}>
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
            <SearchBar />
          </div>

          {/* Collections Table */}
          <CollectionTable />

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </CollectionsProvider>
  )
}

export default CollectionsPage
