import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'

/**
 * Options for useSearchQuery hook.
 */
interface UseSearchQueryOptions {
  /** Initial search query value */
  initialValue?: string
  /** Milliseconds to debounce the search (default: 300) */
  debounceMs?: number
  /** Callback fired after debounce delay when query changes */
  onSearch?: (query: string) => void
}

/**
 * Return type for useSearchQuery hook.
 */
interface UseSearchQueryReturn {
  /** Current input value (updates immediately on typing) */
  inputValue: string
  /** Debounced search query (updates after delay) */
  searchQuery: string
  /** True while waiting for debounce or executing onSearch */
  isSearching: boolean
  /** Update the input value directly */
  setInputValue: (value: string) => void
  /** Clear both input and search, trigger onSearch('') */
  clearSearch: () => void
}

/**
 * Manages a search query with debouncing, loading state, and clear functionality.
 * Automatically syncs with an initial value and triggers callbacks after the debounce delay.
 *
 * @example
 * // Basic usage
 * const { inputValue, setInputValue, clearSearch, isSearching } = useSearchQuery({
 *   debounceMs: 300,
 *   onSearch: (query) => console.log('Search for:', query)
 * })
 *
 * @example
 * // With URL sync
 * const search = Route.useSearch()
 * const navigate = Route.useNavigate()
 *
 * const { inputValue, setInputValue, clearSearch } = useSearchQuery({
 *   initialValue: search.q || '',
 *   onSearch: (query) => navigate({ search: { q: query } })
 * })
 *
 * @example
 * // In JSX
 * <input
 *   value={inputValue}
 *   onChange={(e) => setInputValue(e.target.value)}
 *   placeholder="Search..."
 * />
 * {isSearching && <Spinner />}
 * <button onClick={clearSearch}>Clear</button>
 */
export function useSearchQuery(options: UseSearchQueryOptions = {}): UseSearchQueryReturn {
  const { initialValue = '', debounceMs = 300, onSearch } = options
  
  const [inputValue, setInputValue] = useState(initialValue)
  const [isSearching, setIsSearching] = useState(false)
  
  const debouncedQuery = useDebounce(inputValue, debounceMs)
  
  // Sync input with external initial value changes
  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue])
  
  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedQuery !== initialValue) {
      setIsSearching(true)
      onSearch?.(debouncedQuery)
      setIsSearching(false)
    }
  }, [debouncedQuery, initialValue, onSearch])
  
  const clearSearch = () => {
    setInputValue('')
    onSearch?.('')
  }
  
  return {
    inputValue,
    searchQuery: debouncedQuery,
    isSearching,
    setInputValue,
    clearSearch,
  }
}
