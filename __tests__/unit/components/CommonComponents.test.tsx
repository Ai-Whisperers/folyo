import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from '../../../components/common/Navbar'
import { Footer } from '../../../components/common/Footer'
import { LoadingSpinner, PageLoading, SkeletonCard, SkeletonList } from '../../../components/common/LoadingSpinner'
import { ErrorMessage, NotFound } from '../../../components/common/ErrorBoundary'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/link
jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('Navbar Component', () => {
  it('renders logo and brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Folyo')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('Templates')).toBeInTheDocument()
    expect(screen.getByText('Portfolios')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('renders auth buttons when showAuth is true', () => {
    render(<Navbar showAuth={true} />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Get Started Free')).toBeInTheDocument()
  })

  it('hides auth buttons when showAuth is false', () => {
    render(<Navbar showAuth={false} />)
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
    expect(screen.queryByText('Get Started Free')).not.toBeInTheDocument()
  })

  it('applies dark variant styles', () => {
    const { container } = render(<Navbar variant="dark" />)
    expect(container.querySelector('nav')).toHaveClass('bg-gray-900/80')
  })

  it('applies light variant styles', () => {
    const { container } = render(<Navbar variant="light" />)
    expect(container.querySelector('nav')).toHaveClass('bg-white/80')
  })

  it('toggles mobile menu on button click', () => {
    render(<Navbar />)
    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)
    // After clicking, the mobile menu should be visible (extra Templates link appears)
    const templatesLinks = screen.getAllByText('Templates')
    expect(templatesLinks.length).toBeGreaterThan(1)
  })
})

describe('Footer Component', () => {
  it('renders brand and tagline', () => {
    render(<Footer />)
    expect(screen.getByText('Folyo')).toBeInTheDocument()
    expect(screen.getByText('Your career, beautifully presented.')).toBeInTheDocument()
  })

  it('renders product links', () => {
    render(<Footer />)
    expect(screen.getByText('Templates')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Gallery')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('renders resource links', () => {
    render(<Footer />)
    expect(screen.getByText('Live Demo')).toBeInTheDocument()
    expect(screen.getByText('CV Builder')).toBeInTheDocument()
  })

  it('renders company links', () => {
    render(<Footer />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Privacy')).toBeInTheDocument()
    expect(screen.getByText('Terms')).toBeInTheDocument()
  })

  it('shows current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
  })

  it('applies dark variant styles', () => {
    const { container } = render(<Footer variant="dark" />)
    expect(container.querySelector('footer')).toHaveClass('bg-gray-900')
  })

  it('applies light variant styles', () => {
    const { container } = render(<Footer variant="light" />)
    expect(container.querySelector('footer')).toHaveClass('bg-gray-100')
  })
})

describe('LoadingSpinner Component', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows message when provided', () => {
    render(<LoadingSpinner message="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { container, rerender } = render(<LoadingSpinner size="sm" />)
    expect(container.querySelector('.w-5')).toBeInTheDocument()

    rerender(<LoadingSpinner size="lg" />)
    expect(container.querySelector('.w-12')).toBeInTheDocument()
  })

  it('renders fullScreen mode', () => {
    const { container } = render(<LoadingSpinner fullScreen />)
    expect(container.querySelector('.fixed')).toBeInTheDocument()
    expect(container.querySelector('.inset-0')).toBeInTheDocument()
  })
})

describe('PageLoading Component', () => {
  it('renders loading indicator with message', () => {
    render(<PageLoading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('has proper height', () => {
    const { container } = render(<PageLoading />)
    expect(container.querySelector('.min-h-\\[60vh\\]')).toBeInTheDocument()
  })
})

describe('SkeletonCard Component', () => {
  it('renders with animate-pulse', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})

describe('SkeletonList Component', () => {
  it('renders with animate-pulse', () => {
    const { container } = render(<SkeletonList />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('includes avatar placeholder', () => {
    const { container } = render(<SkeletonList />)
    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
  })
})

describe('ErrorMessage Component', () => {
  it('renders default title and message', () => {
    render(<ErrorMessage />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
  })

  it('renders custom title and message', () => {
    render(<ErrorMessage title="Custom Error" message="Custom message" />)
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Custom message')).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = jest.fn()
    render(<ErrorMessage onRetry={onRetry} />)
    const retryButton = screen.getByText('Retry')
    expect(retryButton).toBeInTheDocument()

    fireEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('hides retry button when onRetry is not provided', () => {
    render(<ErrorMessage />)
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })
})

describe('NotFound Component', () => {
  it('renders 404 message', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('provides link to homepage', () => {
    render(<NotFound />)
    expect(screen.getByText('Go to Homepage')).toBeInTheDocument()
  })
})
