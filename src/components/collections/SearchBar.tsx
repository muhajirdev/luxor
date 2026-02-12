/**
 * SearchBar Component
 *
 * Real-time search input with debouncing and URL sync.
 *
 * @see ./README.md for full architecture documentation
 */
import { Search, Loader2 } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useCollections } from './CollectionsContext'
import { useSearchQuery } from '@/hooks/useSearchQuery'

const DEBOUNCE_MS = 300

export const SearchBar = memo(function SearchBar() {
  const { searchQuery: initialQuery, setSearchQuery } = useCollections()
  
  const {
    inputValue,
    isSearching,
    setInputValue,
    clearSearch,
  } = useSearchQuery({
    initialValue: initialQuery,
    debounceMs: DEBOUNCE_MS,
    onSearch: setSearchQuery,
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [setInputValue])

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a4a]" />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search collections..."
        className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-4 pl-12 pr-12 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
      />
      {isSearching ? (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b87333] animate-spin" />
      ) : inputValue ? (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-[#fafaf9] transition-colors"
          type="button"
        >
          ×
        </button>
      ) : null}
    </div>
  )
})
