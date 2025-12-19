import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Folyo Middleware
 * Handles subdomain routing for portfolio pages
 *
 * URL Patterns:
 * - folyo.com/cv/john-doe -> Standard path-based portfolio
 * - john-doe.folyo.com -> Subdomain-based portfolio (Premium)
 * - custom-domain.com -> Custom domain portfolio (Premium+)
 */

// Reserved subdomains that should not be treated as portfolio slugs
const RESERVED_SUBDOMAINS = [
  'www',
  'app',
  'api',
  'admin',
  'dashboard',
  'auth',
  'login',
  'signup',
  'blog',
  'docs',
  'help',
  'support',
  'mail',
  'email',
  'cdn',
  'static',
  'assets',
  'images',
  'img',
  'media',
  'files',
  'dev',
  'staging',
  'test',
  'demo'
]

// Main domain (configure via environment variable)
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'folyo.com'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next()
  }

  // Development mode: skip subdomain handling for localhost
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    return NextResponse.next()
  }

  // Check if this is the main domain or www
  const isMainDomain =
    host === MAIN_DOMAIN ||
    host === `www.${MAIN_DOMAIN}` ||
    host.endsWith(`.${MAIN_DOMAIN}`) === false

  if (isMainDomain) {
    return NextResponse.next()
  }

  // Extract subdomain from host
  // Example: john-doe.folyo.com -> john-doe
  const subdomain = host.split('.')[0]

  // Skip reserved subdomains
  if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
    return NextResponse.next()
  }

  // Validate subdomain format (alphanumeric and hyphens only)
  if (!/^[a-z0-9-]+$/i.test(subdomain)) {
    return NextResponse.next()
  }

  // If we're already on a portfolio page, don't rewrite
  if (url.pathname.startsWith('/cv/')) {
    return NextResponse.next()
  }

  // Rewrite to portfolio page
  // john-doe.folyo.com -> /cv/john-doe
  if (url.pathname === '/' || url.pathname === '') {
    url.pathname = `/cv/${subdomain.toLowerCase()}`
    return NextResponse.rewrite(url)
  }

  // For other paths on subdomain, append to portfolio
  // john-doe.folyo.com/resume -> /cv/john-doe (ignore extra paths)
  url.pathname = `/cv/${subdomain.toLowerCase()}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
}
