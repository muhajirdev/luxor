import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'
import { HeaderSearch } from './HeaderSearch'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const isLoggedIn = !!user
  const location = useLocation()
  const isCollectionsPage = location.pathname === '/collections'

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

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

        {/* Search Bar - Hidden on collections page */}
        {!isCollectionsPage && (
          <div className="hidden flex-1 px-8 lg:px-12 xl:px-16 md:block">
            <HeaderSearch className="max-w-md mx-auto" />
          </div>
        )}

        {/* Desktop Navigation + CTA Group */}
        <div className="hidden items-center gap-8 lg:gap-12 md:flex">
          <nav className="flex items-center gap-6 lg:gap-8">
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

          <div className="flex items-center gap-4 lg:gap-6">
            {isLoggedIn ? (
              <>
                <Link
                  to="/app"
                  className="flex items-center gap-2 label text-[#8a8a8a] transition-colors duration-300 hover:text-[#fafaf9]"
                >
                  <User className="h-4 w-4" />
                  {user?.name}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 label text-[#8a8a8a] transition-colors duration-300 hover:text-[#fafaf9] bg-transparent border-none cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="label text-[#8a8a8a] transition-colors duration-300 hover:text-[#fafaf9]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Begin Collecting
                </Link>
              </>
            )}
          </div>
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
            {/* Mobile Search - Hidden on collections page */}
            {!isCollectionsPage && (
              <HeaderSearch />
            )}

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

            {isLoggedIn ? (
              <div className="space-y-4">
                <Link
                  to="/app"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 font-editorial text-lg text-[#b0b0b0] transition-colors hover:text-[#fafaf9]"
                >
                  <User className="h-5 w-5" />
                  {user?.name}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 font-editorial text-lg text-[#b0b0b0] transition-colors hover:text-[#fafaf9] bg-transparent border-none cursor-pointer w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block font-editorial text-lg text-[#b0b0b0] transition-colors hover:text-[#fafaf9]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Begin Collecting
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
