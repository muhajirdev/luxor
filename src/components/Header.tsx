import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#000000]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-12">
        {/* Logo - Editorial Style */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative flex h-12 w-12 items-center justify-center border border-[#2a2a2a] bg-[#0a0a0a] transition-all duration-500 group-hover:border-[#b87333]">
            <span className="font-display text-2xl font-bold text-[#fafaf9]">L</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display text-xl font-semibold tracking-tight text-[#fafaf9]">
              Luxor
            </span>
            <span className="label-sm text-[#8a8a8a]">
              Auction House
            </span>
          </div>
        </Link>

        {/* Search Bar - Editorial */}
        <div className="hidden flex-1 px-12 md:block">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a4a4a]" />
            <input
              type="text"
              placeholder="Search catalog..."
              className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-3 pl-12 pr-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/collections"
            className="label text-[#8a8a8a] transition-colors duration-300 hover:text-[#fafaf9]"
          >
            Catalog
          </Link>
          <Link
            to="/how-it-works"
            className="label text-[#8a8a8a] transition-colors duration-300 hover:text-[#fafaf9]"
          >
            Guide
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/login"
            className="label text-[#8a8a8a] transition-colors duration-300 hover:text-[#fafaf9]"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn-primary"
          >
            Begin Collecting
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center border border-[#1a1a1a] text-[#8a8a8a] transition-all duration-300 hover:border-[#b87333] hover:text-[#fafaf9] md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute left-0 right-0 border-b border-[#1a1a1a] bg-[#000000]/98 backdrop-blur-xl md:hidden">
          <div className="space-y-6 px-6 py-8">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a4a4a]" />
              <input
                type="text"
                placeholder="Search catalog..."
                className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-4 pl-12 pr-4 font-editorial text-base text-[#fafaf9] placeholder-[#4a4a4a] focus:border-[#b87333] focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              <Link
                to="/collections"
                onClick={() => setIsOpen(false)}
                className="block font-editorial text-lg text-[#b0b0b0] transition-colors hover:text-[#fafaf9]"
              >
                Catalog
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setIsOpen(false)}
                className="block font-editorial text-lg text-[#b0b0b0] transition-colors hover:text-[#fafaf9]"
              >
                Guide
              </Link>
            </div>

            <div className="h-px bg-[#1a1a1a]" />

            <div className="space-y-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block font-editorial text-lg text-[#b0b0b0] transition-colors hover:text-[#fafaf9]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Begin Collecting
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
