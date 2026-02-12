import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import {
  HeroSection,
  FeaturedGrid,
  TrendingTable,
  FeaturesSection,
  CTASection,
  Footer,
} from '@/components/landing'
import {
  getTrendingCollectionsServer,
  getFeaturedCollectionsServer,
  getRecentSoldServer,
} from '@/lib/server/collections.server'

export const Route = createFileRoute('/')({
  component: LandingPage,
  loader: async () => {
    const [trending, featured, recentSold] = await Promise.all([
      getTrendingCollectionsServer(),
      getFeaturedCollectionsServer(),
      getRecentSoldServer(),
    ])
    return { trending, featured, recentSold }
  },
})

function LandingPage() {
  const { trending, featured, recentSold } = Route.useLoaderData()

  const featuredCollections = featured.length > 0 
    ? featured 
    : [{
        id: 'default',
        lot: '001',
        name: 'Premium Collection',
        creator: 'Luxor Bids',
        image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=600&fit=crop',
        itemCount: 0,
        totalValue: 0,
        featured: true,
      }]

  const trendingCollections = trending.length > 0 
    ? trending 
    : []

  const recentSoldItems = recentSold.length > 0
    ? recentSold.map(item => `${item.name} — ${item.price}`)
    : ['No recent sales yet']

  const heroCollection = featuredCollections[0]

  return (
    <div className="min-h-screen bg-[#000000] relative">
      <Header />

      <HeroSection 
        heroCollection={heroCollection} 
        recentSoldItems={recentSoldItems} 
      />

      <FeaturedGrid featuredCollections={featuredCollections} />

      <TrendingTable trendingCollections={trendingCollections} />

      <FeaturesSection />

      <CTASection />

      <Footer />
    </div>
  )
}

export default LandingPage
