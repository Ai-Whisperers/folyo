import { render, screen, waitFor } from '@testing-library/react'
import { AnalyticsCard } from '@/components/cv/AnalyticsCard'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('AnalyticsCard', () => {
  const mockAnalytics = {
    views: 1234,
    downloads: 56,
    uniqueVisitors: 789,
  }

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('shows loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<AnalyticsCard cvId="test-cv-id" />)

    // Should show loading skeleton
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('fetches analytics on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalytics,
    })

    render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/cvs/test-cv-id/analytics')
    })
  })

  it('displays views count', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalytics,
    })

    render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      expect(screen.getByText('1,234')).toBeInTheDocument()
      expect(screen.getByText('Total Views')).toBeInTheDocument()
    })
  })

  it('displays downloads count', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalytics,
    })

    render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      expect(screen.getByText('56')).toBeInTheDocument()
      expect(screen.getByText('Downloads')).toBeInTheDocument()
    })
  })

  it('displays unique visitors count', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalytics,
    })

    render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      expect(screen.getByText('789')).toBeInTheDocument()
      expect(screen.getByText('Unique Visitors')).toBeInTheDocument()
    })
  })

  it('renders nothing when no analytics data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    })

    const { container } = render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { container } = render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      // Should render nothing on error
      expect(container.firstChild).toBeNull()
    })
  })

  it('formats large numbers with commas', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ views: 1000000, downloads: 50000, uniqueVisitors: 100000 }),
    })

    render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      expect(screen.getByText('1,000,000')).toBeInTheDocument()
      expect(screen.getByText('50,000')).toBeInTheDocument()
      expect(screen.getByText('100,000')).toBeInTheDocument()
    })
  })

  it('shows title', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalytics,
    })

    render(<AnalyticsCard cvId="test-cv-id" />)

    await waitFor(() => {
      expect(screen.getByText('Portfolio Analytics')).toBeInTheDocument()
    })
  })
})
