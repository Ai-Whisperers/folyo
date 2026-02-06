/**
 * Folyo Pricing Tiers
 * Defines subscription plans and feature access
 */

export interface PricingFeatures {
  maxPortfolios: number | 'unlimited'
  maxStorage: number // in MB
  themes: string[] | 'all'
  aiBuilder: boolean
  videoPortfolio: boolean
  analytics: boolean
  pdfExport: boolean
  qrCode: boolean
  customSlug: boolean
  subdomain: boolean
  customDomain: boolean
  removeWatermark: boolean
}

export interface PricingTier {
  name: string
  price: number // per month in USD
  features: PricingFeatures
  description: string
  recommended?: boolean
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: {
      maxPortfolios: 1,
      maxStorage: 10,
      themes: ['teal', 'blue', 'oceanstale'],
      aiBuilder: false,
      videoPortfolio: false,
      analytics: false,
      pdfExport: false,
      qrCode: true,
      customSlug: true,
      subdomain: false,
      customDomain: false,
      removeWatermark: false
    }
  },
  pro: {
    name: 'Pro',
    price: 10,
    description: 'For professionals who want to stand out',
    recommended: true,
    features: {
      maxPortfolios: 5,
      maxStorage: 100,
      themes: 'all',
      aiBuilder: true,
      videoPortfolio: true,
      analytics: true,
      pdfExport: true,
      qrCode: true,
      customSlug: true,
      subdomain: false,
      customDomain: false,
      removeWatermark: true
    }
  },
  premium: {
    name: 'Premium',
    price: 25,
    description: 'Full control over your online presence',
    features: {
      maxPortfolios: 'unlimited',
      maxStorage: 500,
      themes: 'all',
      aiBuilder: true,
      videoPortfolio: true,
      analytics: true,
      pdfExport: true,
      qrCode: true,
      customSlug: true,
      subdomain: true,
      customDomain: true,
      removeWatermark: true
    }
  }
}

/**
 * Check if a user can use a specific feature based on their plan
 */
export function canUseFeature(
  userPlan: string,
  feature: keyof PricingFeatures
): boolean {
  const tier = PRICING_TIERS[userPlan] || PRICING_TIERS.free
  const featureValue = tier.features[feature]

  // Handle boolean features
  if (typeof featureValue === 'boolean') {
    return featureValue
  }

  // Handle 'all' or 'unlimited' values
  if (featureValue === 'all' || featureValue === 'unlimited') {
    return true
  }

  // Handle numeric limits (> 0 means feature is available)
  if (typeof featureValue === 'number') {
    return featureValue > 0
  }

  // Handle array of themes
  if (Array.isArray(featureValue)) {
    return featureValue.length > 0
  }

  return false
}

/**
 * Check if a theme is available for a user's plan
 */
export function canUseTheme(userPlan: string, themeId: string): boolean {
  const tier = PRICING_TIERS[userPlan] || PRICING_TIERS.free
  const themes = tier.features.themes

  if (themes === 'all') {
    return true
  }

  return Array.isArray(themes) && themes.includes(themeId)
}

/**
 * Get the limit for a numeric feature
 */
export function getFeatureLimit(
  userPlan: string,
  feature: 'maxPortfolios' | 'maxStorage'
): number | 'unlimited' {
  const tier = PRICING_TIERS[userPlan] || PRICING_TIERS.free
  return tier.features[feature]
}

/**
 * Get available themes for a plan
 */
export function getAvailableThemes(userPlan: string): string[] | 'all' {
  const tier = PRICING_TIERS[userPlan] || PRICING_TIERS.free
  return tier.features.themes
}
