'use client'

import { normalizePortfolioData, type PortfolioLayoutType } from '@/lib/types/cv'
import { HeroCentered, HeroSplit, HeroMinimal, HeroFullscreen } from './layouts'

interface PortfolioViewProps {
  data: any // Accept any format, normalizer will handle it
  themeId?: string // Legacy support
}

export default function PortfolioView({ data, themeId }: PortfolioViewProps) {
  // Normalize the data to handle both old and new formats
  const normalizedData = normalizePortfolioData(data)

  // If themeId is passed (legacy), override the palette
  if (themeId && !data.color_palette) {
    const paletteFromTheme = normalizePortfolioData({ ...data, theme_skin: themeId })
    normalizedData.palette = paletteFromTheme.palette
  }

  // Select layout based on data.layout
  const layout = normalizedData.layout

  switch (layout) {
    case 'hero-split':
      return <HeroSplit data={normalizedData} />
    case 'hero-minimal':
      return <HeroMinimal data={normalizedData} />
    case 'hero-fullscreen':
      return <HeroFullscreen data={normalizedData} />
    case 'hero-centered':
    default:
      return <HeroCentered data={normalizedData} />
  }
}
