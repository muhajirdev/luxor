import { ChevronDown, User, X } from 'lucide-react'
import { useCallback } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useCollections } from './CollectionsContext'

const PRICE_RANGES = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under $100', min: null, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000+', min: 1000, max: null },
]

interface FilterBarProps {
  showMine?: boolean
  onToggleMine?: () => void
}

export function FilterBar({ showMine = false, onToggleMine }: FilterBarProps) {
  const { filters, setFilters } = useCollections()
  const { user } = useAuth()
  const isLoggedIn = !!user

  const handleStatusChange = useCallback((status: 'all' | 'active' | 'sold') => {
    setFilters({ status })
  }, [setFilters])

  const handlePriceChange = useCallback((min: number | null, max: number | null) => {
    setFilters({ minPrice: min, maxPrice: max })
  }, [setFilters])

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      minPrice: null,
      maxPrice: null,
      category: null,
      ownerId: null,
    })
    onToggleMine?.()
  }, [setFilters, onToggleMine])

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    showMine

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter - Pill Style */}
      <div className="flex items-center rounded-lg border border-[#1a1a1a] overflow-hidden bg-[#0a0a0a]">
        {(['all', 'active', 'sold'] as const).map((status, index) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 text-sm capitalize transition-all duration-200 ${
              index !== 0 ? 'border-l border-[#1a1a1a]' : ''
            } ${
              filters.status === status
                ? 'bg-[#b87333] text-[#000000] font-medium'
                : 'bg-transparent text-[#8a8a8a] hover:text-[#fafaf9]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Price Range - Custom Dropdown */}
      <div className="relative group">
        <select
          value={`${filters.minPrice ?? ''}-${filters.maxPrice ?? ''}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-').map(v => v ? parseInt(v) : null)
            handlePriceChange(min, max)
          }}
          className="appearance-none px-4 py-2 pr-10 text-sm bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-[#fafaf9] cursor-pointer hover:border-[#4a4a4a] focus:border-[#b87333] focus:outline-none transition-colors min-w-[140px]"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.label} value={`${range.min ?? ''}-${range.max ?? ''}`}>
              {range.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a] pointer-events-none" />
      </div>

      {/* My Collections Toggle */}
      {isLoggedIn && onToggleMine && (
        <button
          onClick={onToggleMine}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
            showMine
              ? 'bg-[#b87333] text-[#000000] border-[#b87333] font-medium'
              : 'bg-[#0a0a0a] text-[#8a8a8a] border-[#1a1a1a] hover:border-[#4a4a4a] hover:text-[#fafaf9]'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">My Collections</span>
          <span className="sm:hidden">Mine</span>
        </button>
      )}

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-[#8a8a8a] hover:text-[#b87333] transition-colors"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  )
}
