import { memo, useCallback } from 'react'
import { useCollections } from './CollectionsContext'
import { Loader2 } from 'lucide-react'

export const Pagination = memo(function Pagination() {
  const { pagination, goToPage, isLoading } = useCollections()
  const { page, totalPages, totalCount } = pagination

  const handlePrevious = useCallback(() => {
    if (page > 1) goToPage(page - 1)
  }, [page, goToPage])

  const handleNext = useCallback(() => {
    if (page < totalPages) goToPage(page + 1)
  }, [page, totalPages, goToPage])

  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="label-sm text-[#4a4a4a]">
        Showing {pagination.limit} of {totalCount} collections
      </div>
      
      <div className="flex items-center gap-2">
        <button
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
