import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/collections')({
  component: CollectionsPage,
})

function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Browse Collections</h1>
      <p className="mt-4 text-slate-400">Coming soon...</p>
    </div>
  )
}
