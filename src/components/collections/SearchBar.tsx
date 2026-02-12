import { Search } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useCollections } from './CollectionsContext'

export const SearchBar = memo(function SearchBar() {
  const { searchQuery, setSearchQuery } = useCollections()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [setSearchQuery])

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a4a4a]" />
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search collections..."
        className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-4 pl-12 pr-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
      />
    </div>
  )
})
