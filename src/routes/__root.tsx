import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { NotFoundComponent } from "@/components/NotFound";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { getCurrentUser } from "@/lib/server/auth.server";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Luxor Bids - Where Serious Collectors Bid With Confidence",
      },
      {
        name: "description",
        content:
          "Premium marketplace for physical collectibles. Estate sales, vintage items, art, watches, and rare finds. 3% fee, 7-day auction cycles, curated listings.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
  }),

  loader: async () => {
    const userResult = await getCurrentUser();
    return { user: userResult.success ? userResult.user : null };
  },

  notFoundComponent: NotFoundComponent,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const data = Route.useLoaderData();

  return (
    <html lang="en">
      <head>
        {/**
         * React Scan - Performance debugging tool
         * https://github.com/aidenybai/react-scan
         *
         * Visualizes component re-renders to identify performance issues:
         * - Highlights components that re-render with color-coded borders
         * - Shows render frequency and timing
         * - Helps catch unnecessary re-renders
         *
         * To enable: Uncomment the script below and refresh the page
         * Only use in development - remove before production
         */}
        {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
        <HeadContent />
      </head>
      <body className="bg-slate-950 text-slate-200 antialiased">
        <AuthProvider initialUser={data.user}>{children}</AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
