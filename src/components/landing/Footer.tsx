import { Link } from '@tanstack/react-router'

interface FooterSection {
  title: string
  links: string[]
}

const footerSections: FooterSection[] = [
  {
    title: 'Marketplace',
    links: ['Browse Catalog', 'Trending', 'New Arrivals', 'Auctions'],
  },
  {
    title: 'Company',
    links: ['About', 'How It Works', 'Pricing', 'Press'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Contact', 'Trust & Safety', 'Terms'],
  },
]

const socialLinks = ['Twitter', 'Discord', 'Instagram']

export function Footer() {
  return (
    <footer className="relative border-t border-[#1a1a1a] bg-[#000000]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Top Section */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-5">
              <Link to="/" className="flex items-center gap-4 mb-6"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-[#2a2a2a] bg-[#0a0a0a]"
                >
                  <span className="font-display text-2xl font-bold text-[#fafaf9]">L</span>
                </div>
                <div>
                  <span className="font-display text-2xl font-semibold text-[#fafaf9]">
                    Luxor
                  </span>
                  <span className="font-display text-2xl font-light italic text-[#b87333] ml-1">
                    Bids
                  </span>
                </div>
              </Link>

              <p className="body-md text-[#8a8a8a] max-w-sm mb-8"
              >
                Premium marketplace for physical collectibles. Estate sales, vintage
                items, art, and rare finds. Where serious collectors bid with confidence.
              </p>

              <div className="flex gap-6"
              >
                {socialLinks.map((social) => (
                  <span
                    key={social}
                    className="label text-[#4a4a4a] transition-colors hover:text-[#b87333] cursor-pointer"
                  >
                    {social}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8"
              >
                {footerSections.map((section) => (
                  <div key={section.title}
                  >
                    <h3 className="label text-[#4a4a4a] mb-6"
                    >
                      {section.title}
                    </h3>

                    <ul className="space-y-3"
                    >
                      {section.links.map((link) => (
                        <li key={link}
                        >
                          <span className="body-sm text-[#8a8a8a] transition-colors hover:text-[#fafaf9] cursor-pointer"
                          >
                            {link}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#1a1a1a] py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <p className="label-sm text-[#4a4a4a]"
            >
              © {new Date().getFullYear()} Luxor Bids. All rights reserved.
            </p>

            <div className="flex items-center gap-8"
            >
              <Link to="/privacy" className="label-sm text-[#4a4a4a] cursor-pointer hover:text-[#8a8a8a]"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="label-sm text-[#4a4a4a] cursor-pointer hover:text-[#8a8a8a]"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
