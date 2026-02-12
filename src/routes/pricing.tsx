import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Pricing</h1>
      <p className="mt-4 text-slate-400">Coming soon...</p>
    </div>
  )
}
