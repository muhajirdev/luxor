import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/lib/server/auth.server'

export const Route = createFileRoute('/app/')({
  component: AppLayout,
  beforeLoad: async () => {
    const result = await getCurrentUser()
    
    if (!result.success || !result.user) {
      throw redirect({ to: '/login' })
    }
    
    return { user: result.user }
  },
})

function AppLayout() {
  const { user } = Route.useRouteContext()
  
  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="headline-lg text-[#fafaf9]">Welcome, {user.name}</h1>
          <p className="body-md text-[#8a8a8a] mt-2">
            Manage your collections and bids
          </p>
        </div>
        <div className="editorial-frame">
          <div className="editorial-frame-inner p-8">
            <p className="text-[#8a8a8a]">Protected content goes here...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
