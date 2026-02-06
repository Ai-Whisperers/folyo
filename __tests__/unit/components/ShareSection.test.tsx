import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ShareSection } from '@/components/cv/ShareSection'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ShareSection', () => {
  const defaultProps = {
    slug: 'john-doe',
    theme: 'teal',
    name: 'John Doe',
  }

  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ qrCode: 'data:image/png;base64,mockQRCode' }),
    })
  })

  it('renders portfolio URL correctly', () => {
    render(<ShareSection {...defaultProps} />)

    const input = screen.getByDisplayValue(/john-doe/)
    expect(input).toBeInTheDocument()
  })

  it('renders share section title', () => {
    render(<ShareSection {...defaultProps} />)

    expect(screen.getByText('Share Your Portfolio')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<ShareSection {...defaultProps} />)

    // Should show loading skeleton before QR loads
    expect(screen.getByText('QR Code')).toBeInTheDocument()
  })

  it('generates QR code on mount', async () => {
    render(<ShareSection {...defaultProps} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/user/qrcode', expect.any(Object))
    })
  })

  it('copies URL to clipboard when copy button clicked', async () => {
    render(<ShareSection {...defaultProps} />)

    const copyButton = screen.getAllByRole('button')[0]
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
  })

  it('shows QR code after loading', async () => {
    render(<ShareSection {...defaultProps} />)

    await waitFor(() => {
      const qrImage = screen.getByAltText('Portfolio QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('has download QR button', async () => {
    render(<ShareSection {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Download QR Code')).toBeInTheDocument()
    })
  })

  it('has share portfolio button', () => {
    render(<ShareSection {...defaultProps} />)

    expect(screen.getByText('Share Portfolio')).toBeInTheDocument()
  })

  it('has preview link', () => {
    render(<ShareSection {...defaultProps} />)

    expect(screen.getByText(/Preview your public portfolio/)).toBeInTheDocument()
  })

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<ShareSection {...defaultProps} />)

    await waitFor(() => {
      // Should not crash, just show placeholder
      expect(screen.getByText('QR Code')).toBeInTheDocument()
    })
  })
})
