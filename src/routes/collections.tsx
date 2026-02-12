import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { z } from 'zod'
import { useCallback } from 'react'
import { Header } from '@/components/Header'
import { getCollectionsListServer } from '@/lib/server/collections.server'
import { getCurrentUser } from '@/lib/server/auth.server'
import {
  CollectionsProvider,
  SearchBar,
  FilterBar,
  CollectionTable,
  Pagination,
  type FilterState,
} from '@/components/collections'

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.number().optional(),
  status: z.enum(['all', 'active', 'sold']).optional().default('all'),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  mine: z.boolean().optional().default(false),
})

export const Route = createFileRoute('/collections')({
  component: CollectionsPage,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const searchQuery = deps.q || ''
    const page = deps.page || 1
    const status = deps.status || 'all'
    const minPrice = deps.minPrice
    const maxPrice = deps.maxPrice
    const mine = deps.mine || false

    // Get current user for "my collections" filter
    const userResult = await getCurrentUser()
    const ownerId = mine && userResult.success && userResult.user ? userResult.user.id : undefined

    return await getCollectionsListServer({
      data: {
        search: searchQuery,
        page,
        limit: 20,
        status,
        minPrice,
        maxPrice,
        ownerId,
      },
    })
  },
})

function CollectionsPage() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const isLoading = useRouterState({ select: (s) => s.isLoading })

  const handleSearch = useCallback((query: string) => {
    navigate({
      search: (prev) => ({ ...prev, q: query || undefined, page: 1 }),
    })
  }, [navigate])

  const handleFilterChange = useCallback((filters: FilterState) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: filters.status !== 'all' ? filters.status : undefined,
        minPrice: filters.minPrice ?? undefined,
        maxPrice: filters.maxPrice ?? undefined,
        page: 1,
      }),
    })
  }, [navigate])

  const handleToggleMine = useCallback((mine: boolean) => {
    navigate({
      search: (prev) => ({
        ...prev,
        mine: mine || undefined,
        page: 1,
      }),
    })
  }, [navigate])

  const handlePageChange = useCallback((page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: page > 1 ? page : undefined,
      }),
    })
  }, [navigate])

  const initialFilters: Partial<FilterState> = {
    status: search.status || 'all',
    minPrice: search.minPrice || null,
    maxPrice: search.maxPrice || null,
    ownerId: search.mine ? 'mine' : null,
  }

  return (
    <CollectionsProvider
      data={data}
      initialSearch={search.q || ''}
      onSearch={handleSearch}
      initialFilters={initialFilters}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
      isLoading={isLoading}
    >
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

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <SearchBar />
            <FilterBar showMine={search.mine || false} onToggleMine={() => handleToggleMine(!search.mine)} />
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
