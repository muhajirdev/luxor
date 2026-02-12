/**
 * Collections Context
 * 
 * Provides global state for collections page following two key patterns:
 * 
 * 1. STATE COLOCATION
 * Only truly global state lives here (search, pagination). Local state like 
 * expandedId is kept in CollectionTable component since only it needs it.
 * 
 * 2. ID-BASED SELECTION (Relay-style)
 * Instead of passing full objects down the tree, we store data in a Map and 
 * provide a getCollection(id) function. Components pass IDs and select their 
 * own data via useCollection(id) hook.
 * 
 * Why this matters:
 * - Primitive props (strings) work with default React.memo comparison
 * - No custom comparison functions needed
 * - Components declare what data they need
 * 
 * Usage:
 *   // In parent: Wrap with provider
 *   <CollectionsProvider data={serverData}>
 *     <SearchBar />
 *     <CollectionTable />
 *   </CollectionsProvider>
 * 
 *   // In child component: Select by ID
 *   const collection = useCollection(collectionId)
 * 
 * @see docs/architecture.md for full pattern documentation
 */
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'

export interface Collection {
  id: string
  lot: string
  name: string
  description: string | null
  image: string
  seller: string
  sellerId: string
  startingPrice: number
  currentBid: number
  bidCount: number
  status: string
  endsAt: Date | null
  createdAt: Date
}

export interface PaginationInfo {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

export interface CollectionsData {
  collections: Collection[]
  pagination: PaginationInfo
}

interface CollectionsContextValue {
  // Data - stored in Map for O(1) lookup by ID
  collections: Collection[]
  getCollection: (id: string) => Collection | undefined
  pagination: PaginationInfo

  // Search - global: SearchBar writes, CollectionTable reads
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredCollections: Collection[]

  // Pagination
  goToPage: (page: number) => void

  // Refresh
  refreshCollections: () => void
}

const CollectionsContext = createContext<CollectionsContextValue | null>(null)

export function useCollections() {
  const context = useContext(CollectionsContext)
  if (!context) {
    throw new Error('useCollections must be used within CollectionsProvider')
  }
  return context
}

// Select a single collection by ID from context
// Usage: const collection = useCollection(collectionId)
export function useCollection(id: string) {
  const { getCollection } = useCollections()
  return getCollection(id)
}

interface CollectionsProviderProps {
  children: React.ReactNode
  data: CollectionsData
  initialSearch?: string
  onSearch?: (query: string) => void
}

export function CollectionsProvider({ children, data, initialSearch = '', onSearch }: CollectionsProviderProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(data.pagination.page)

  // Sync search query with URL
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }, [onSearch])

  // Memoize the lookup map for O(1) selection by ID
  const collectionMap = useMemo(() => {
    const map = new Map<string, Collection>()
    data.collections.forEach(c => map.set(c.id, c))
    return map
  }, [data.collections])

  const getCollection = useMemo(() => {
    return (id: string) => collectionMap.get(id)
  }, [collectionMap])

  // Server-side search - no client-side filtering needed
  const filteredCollections = data.collections

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshCollections = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // Sync with URL search changes
  useEffect(() => {
    setSearchQuery(initialSearch)
  }, [initialSearch])

  const value = useMemo(() => ({
    collections: data.collections,
    getCollection,
    pagination: { ...data.pagination, page: currentPage },
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    filteredCollections,
    goToPage: setCurrentPage,
    refreshCollections,
  }), [
    data.collections,
    data.pagination,
    collectionMap,
    getCollection,
    currentPage,
    searchQuery,
    filteredCollections,
    refreshCollections,
    refreshKey,
    handleSetSearchQuery,
  ])

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  )
}
