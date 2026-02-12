import { useState, useCallback, KeyboardEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'

interface HeaderSearchProps {
  className?: string
}

/**
 * HeaderSearch - Quick search that navigates to collections page
 * 
 * User types and presses Enter → navigates to /collections?q=query
 * On /collections page, the main SearchBar takes over
 */
export function HeaderSearch({ className = '' }: HeaderSearchProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      navigate({
        to: '/collections',
        search: { q: query.trim() },
      })
    } else {
      navigate({ to: '/collections' })
    }
  }, [query, navigate])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a4a4a]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search catalog..."
        className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-3 pl-12 pr-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
      />
    </div>
  )
}
