import { useState, useEffect, useCallback } from 'react'

/**
 * Debounces a value by delaying updates for a specified duration.
 * Useful for search inputs, form validation, or any input that triggers expensive operations.
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 300)
 *
 * useEffect(() => {
 *   // Only runs after user stops typing for 300ms
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Creates a debounced version of a callback function.
 * The callback will only execute after the specified delay has passed since the last call.
 * Useful for event handlers like search, scroll, or resize that shouldn't fire too frequently.
 *
 * @example
 * const handleSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query)
 * }, 300)
 *
 * // In JSX:
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      const id = setTimeout(() => {
        callback(...args)
      }, delay)
      setTimeoutId(id)
    },
    [callback, delay, timeoutId]
  )
}
