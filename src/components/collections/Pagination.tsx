import { Loader2 } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useCollections } from './CollectionsContext'

export const Pagination = memo(function Pagination() {
  const { pagination, goToPage, isLoading } = useCollections()
  const { page, totalPages, totalCount, limit } = pagination

  const handlePrevious = useCallback(() => {
    if (page > 1) goToPage(page - 1)
  }, [page, goToPage])

  const handleNext = useCallback(() => {
    if (page < totalPages) goToPage(page + 1)
  }, [page, totalPages, goToPage])

  const start = totalCount === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, totalCount)

  if (totalCount === 0) return null

  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="label-sm text-[#4a4a4a]">
        Showing <span className="text-[#8a8a8a]">{start}-{end}</span> of <span className="text-[#8a8a8a]">{totalCount}</span> collections
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={page <= 1 || isLoading}
          className="px-4 py-2 border border-[#1a1a1a] label-sm text-[#8a8a8a] transition-all hover:border-[#b87333] hover:text-[#fafaf9] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span className="label-sm text-[#8a8a8a] px-4 flex items-center gap-2">
          Page {page} of {totalPages}
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-[#b87333]" />}
        </span>
        
        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages || isLoading}
          className="px-4 py-2 border border-[#1a1a1a] label-sm text-[#8a8a8a] transition-all hover:border-[#b87333] hover:text-[#fafaf9] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
})
