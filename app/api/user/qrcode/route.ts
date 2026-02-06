import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

// Theme colors for QR codes (matches design-system.ts)
const THEME_COLORS: Record<string, string> = {
  teal: '#20c997',
  blue: '#2E86AB',
  turquoise: '#17a2b8',
  green: '#28a745',
  berry: '#8e44ad',
  orange: '#fd7e14',
  ceramic: '#d4926d',
  oceanstale: '#6c757d',
  coral: '#F43F5E',
  violet: '#7C3AED',
  slate: '#475569',
  charcoal: '#374151',
  'rose-gold': '#B76E79',
  'midnight-blue': '#1e3a5f',
  'sunset-gradient': '#FF6B6B',
  'ocean-gradient': '#667eea',
  'forest-gradient': '#11998e',
  'video-portfolio': '#FF6B6B',
  'midnight-cinema': '#E50914',
  'art-gallery': '#1a1a1a',
  'noir-elegant': '#C9A227',
  'neon-nights': '#00D9FF',
  'developer-dark': '#61DAFB',
  'github-style': '#238636',
  'vscode-dark': '#007ACC',
  'terminal-green': '#00FF00',
  'executive-gold': '#B8860B',
  'corporate-navy': '#1e3a5f',
  'luxury-black': '#C9A227'
}

export async function POST(request: NextRequest) {
  try {
    const { url, theme = 'teal', size = 300 } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Get theme color or default to teal
    const darkColor = THEME_COLORS[theme] || THEME_COLORS.teal

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })

    return NextResponse.json({ qrCode })

  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
