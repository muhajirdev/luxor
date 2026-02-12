import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { getCurrentUser } from '@/lib/server/auth.server'
import { NotFoundComponent } from '@/components/NotFound'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Luxor Bids - Where Serious Collectors Bid With Confidence',
      },
      {
        name: 'description',
        content: 'Premium marketplace for physical collectibles. Estate sales, vintage items, art, watches, and rare finds. 3% fee, 7-day auction cycles, curated listings.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },

    ],
  }),

  loader: async () => {
    const userResult = await getCurrentUser()
    return { user: userResult.success ? userResult.user : null }
  },

  notFoundComponent: NotFoundComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const data = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-950 text-slate-200 antialiased">
        <AuthProvider initialUser={data.user}>
          {children}
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
