'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { SparklesIcon, Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface NavLink {
  href: string
  label: string
}

const navLinks: NavLink[] = [
  { href: '/templates', label: 'Templates' },
  { href: '/portfolios', label: 'Portfolios' },
  { href: '/pricing', label: 'Pricing' },
]

interface NavbarProps {
  variant?: 'light' | 'dark'
  showAuth?: boolean
}

export function Navbar({ variant = 'light', showAuth = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut, isLoading } = useAuth()

  // Hide navbar on builder page (it has its own header)
  if (pathname?.startsWith('/builder')) {
    return null
  }

  const isActive = (href: string) => pathname === href

  const bgClass = variant === 'dark'
    ? 'bg-gray-900/80 border-gray-800'
    : 'bg-white/80 border-gray-100'

  const textClass = variant === 'dark'
    ? 'text-gray-300 hover:text-white'
    : 'text-gray-600 hover:text-gray-900'

  const activeTextClass = variant === 'dark'
    ? 'text-white'
    : 'text-teal-600'

  const logoTextClass = variant === 'dark'
    ? 'text-white'
    : 'text-gray-900'

  const handleSignOut = () => {
    signOut()
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`${bgClass} backdrop-blur-md border-b sticky top-0 z-50`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold ${logoTextClass}`}>Folyo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActive(link.href) ? activeTextClass : textClass
                }`}
              >
                {link.label}
              </Link>
            ))}

            {showAuth && !isLoading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className={`font-medium ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.name?.split(' ')[0] || 'User'}
                      </span>
                    </button>

                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/builder"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <UserCircleIcon className="w-5 h-5" />
                            My Portfolio
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className={`font-medium ${textClass}`}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/templates"
                      className="bg-teal-600 text-white hover:bg-teal-700 px-5 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-teal-500/25"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className={`p-2 rounded-lg ${textClass}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`sm:hidden ${variant === 'dark' ? 'bg-gray-900' : 'bg-white'} border-t ${variant === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 font-medium ${
                  isActive(link.href) ? activeTextClass : textClass
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {showAuth && !isLoading && (
              <>
                <div className={`border-t ${variant === 'dark' ? 'border-gray-800' : 'border-gray-200'} pt-3 mt-3`}>
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 py-2 mb-2">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className={`font-medium ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/builder"
                        className={`block py-2 font-medium ${textClass}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Portfolio
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left py-2 font-medium text-red-600"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/signin"
                        className={`block py-2 font-medium ${textClass}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/templates"
                        className="block w-full text-center bg-teal-600 text-white hover:bg-teal-700 px-5 py-2.5 rounded-xl font-semibold transition-all mt-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started Free
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
