/**
 * Integration tests for QR Code API
 * Tests: POST /api/user/qrcode
 */

import { NextRequest } from 'next/server'

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockQRCode'),
}))

// Import after mocking
import { POST } from '@/app/api/user/qrcode/route'

describe('POST /api/user/qrcode', () => {
  const createRequest = (body: object) => {
    return new NextRequest('http://localhost:3000/api/user/qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  it('returns 400 if URL is missing', async () => {
    const request = createRequest({ theme: 'teal' })
    const response = await POST(request)

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('URL is required')
  })

  it('generates QR code with default theme', async () => {
    const request = createRequest({
      url: 'https://folyo.com/cv/john-doe',
    })
    const response = await POST(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.qrCode).toContain('data:image/png;base64')
  })

  it('generates QR code with specified theme', async () => {
    const QRCode = require('qrcode')

    const request = createRequest({
      url: 'https://folyo.com/cv/john-doe',
      theme: 'berry',
    })
    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      'https://folyo.com/cv/john-doe',
      expect.objectContaining({
        color: expect.objectContaining({
          dark: '#8e44ad', // Berry color
        }),
      })
    )
  })

  it('uses teal color for unknown theme', async () => {
    const QRCode = require('qrcode')

    const request = createRequest({
      url: 'https://folyo.com/cv/john-doe',
      theme: 'unknown-theme',
    })
    await POST(request)

    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        color: expect.objectContaining({
          dark: '#20c997', // Teal color (default)
        }),
      })
    )
  })

  it('respects custom size parameter', async () => {
    const QRCode = require('qrcode')

    const request = createRequest({
      url: 'https://folyo.com/cv/john-doe',
      size: 500,
    })
    await POST(request)

    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        width: 500,
      })
    )
  })

  it('handles QRCode generation errors', async () => {
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockRejectedValueOnce(new Error('Generation failed'))

    const request = createRequest({
      url: 'https://folyo.com/cv/john-doe',
    })
    const response = await POST(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Failed to generate QR code')
  })
})
