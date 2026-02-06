import {
  PRICING_TIERS,
  canUseFeature,
  canUseTheme,
  getFeatureLimit,
  getAvailableThemes,
} from '@/lib/pricing'

describe('Pricing Module', () => {
  describe('PRICING_TIERS', () => {
    it('has free tier', () => {
      expect(PRICING_TIERS.free).toBeDefined()
      expect(PRICING_TIERS.free.price).toBe(0)
    })

    it('has pro tier', () => {
      expect(PRICING_TIERS.pro).toBeDefined()
      expect(PRICING_TIERS.pro.price).toBe(10)
    })

    it('has premium tier', () => {
      expect(PRICING_TIERS.premium).toBeDefined()
      expect(PRICING_TIERS.premium.price).toBe(25)
    })

    it('pro tier is marked as recommended', () => {
      expect(PRICING_TIERS.pro.recommended).toBe(true)
    })

    it('all tiers have required feature keys', () => {
      const requiredFeatures = [
        'maxPortfolios',
        'maxStorage',
        'themes',
        'aiBuilder',
        'videoPortfolio',
        'analytics',
        'pdfExport',
        'qrCode',
        'customSlug',
        'subdomain',
        'customDomain',
        'removeWatermark',
      ]

      Object.values(PRICING_TIERS).forEach((tier) => {
        requiredFeatures.forEach((feature) => {
          expect(tier.features).toHaveProperty(feature)
        })
      })
    })
  })

  describe('canUseFeature', () => {
    describe('Free tier', () => {
      it('can use QR code', () => {
        expect(canUseFeature('free', 'qrCode')).toBe(true)
      })

      it('can use custom slug', () => {
        expect(canUseFeature('free', 'customSlug')).toBe(true)
      })

      it('cannot use AI builder', () => {
        expect(canUseFeature('free', 'aiBuilder')).toBe(false)
      })

      it('cannot use video portfolio', () => {
        expect(canUseFeature('free', 'videoPortfolio')).toBe(false)
      })

      it('cannot use analytics', () => {
        expect(canUseFeature('free', 'analytics')).toBe(false)
      })

      it('cannot use PDF export', () => {
        expect(canUseFeature('free', 'pdfExport')).toBe(false)
      })

      it('cannot use subdomain', () => {
        expect(canUseFeature('free', 'subdomain')).toBe(false)
      })

      it('cannot use custom domain', () => {
        expect(canUseFeature('free', 'customDomain')).toBe(false)
      })
    })

    describe('Pro tier', () => {
      it('can use AI builder', () => {
        expect(canUseFeature('pro', 'aiBuilder')).toBe(true)
      })

      it('can use video portfolio', () => {
        expect(canUseFeature('pro', 'videoPortfolio')).toBe(true)
      })

      it('can use analytics', () => {
        expect(canUseFeature('pro', 'analytics')).toBe(true)
      })

      it('can use PDF export', () => {
        expect(canUseFeature('pro', 'pdfExport')).toBe(true)
      })

      it('can remove watermark', () => {
        expect(canUseFeature('pro', 'removeWatermark')).toBe(true)
      })

      it('cannot use subdomain', () => {
        expect(canUseFeature('pro', 'subdomain')).toBe(false)
      })

      it('cannot use custom domain', () => {
        expect(canUseFeature('pro', 'customDomain')).toBe(false)
      })
    })

    describe('Premium tier', () => {
      it('can use all features', () => {
        const features: (keyof PricingFeatures)[] = [
          'aiBuilder',
          'videoPortfolio',
          'analytics',
          'pdfExport',
          'qrCode',
          'customSlug',
          'subdomain',
          'customDomain',
          'removeWatermark',
        ]

        features.forEach((feature) => {
          expect(canUseFeature('premium', feature)).toBe(true)
        })
      })
    })

    it('defaults to free tier for unknown plan', () => {
      expect(canUseFeature('unknown', 'aiBuilder')).toBe(false)
      expect(canUseFeature('unknown', 'qrCode')).toBe(true)
    })
  })

  describe('canUseTheme', () => {
    it('free tier can use limited themes', () => {
      expect(canUseTheme('free', 'teal')).toBe(true)
      expect(canUseTheme('free', 'blue')).toBe(true)
      expect(canUseTheme('free', 'oceanstale')).toBe(true)
    })

    it('free tier cannot use premium themes', () => {
      expect(canUseTheme('free', 'berry')).toBe(false)
      expect(canUseTheme('free', 'coral')).toBe(false)
    })

    it('pro tier can use all themes', () => {
      expect(canUseTheme('pro', 'teal')).toBe(true)
      expect(canUseTheme('pro', 'berry')).toBe(true)
      expect(canUseTheme('pro', 'coral')).toBe(true)
      expect(canUseTheme('pro', 'midnight-cinema')).toBe(true)
    })

    it('premium tier can use all themes', () => {
      expect(canUseTheme('premium', 'luxury-black')).toBe(true)
      expect(canUseTheme('premium', 'executive-gold')).toBe(true)
    })
  })

  describe('getFeatureLimit', () => {
    it('free tier has 1 portfolio', () => {
      expect(getFeatureLimit('free', 'maxPortfolios')).toBe(1)
    })

    it('free tier has 10MB storage', () => {
      expect(getFeatureLimit('free', 'maxStorage')).toBe(10)
    })

    it('pro tier has 5 portfolios', () => {
      expect(getFeatureLimit('pro', 'maxPortfolios')).toBe(5)
    })

    it('pro tier has 100MB storage', () => {
      expect(getFeatureLimit('pro', 'maxStorage')).toBe(100)
    })

    it('premium tier has unlimited portfolios', () => {
      expect(getFeatureLimit('premium', 'maxPortfolios')).toBe('unlimited')
    })

    it('premium tier has 500MB storage', () => {
      expect(getFeatureLimit('premium', 'maxStorage')).toBe(500)
    })
  })

  describe('getAvailableThemes', () => {
    it('free tier has limited themes', () => {
      const themes = getAvailableThemes('free')
      expect(Array.isArray(themes)).toBe(true)
      expect(themes).toContain('teal')
      expect(themes).toContain('blue')
      expect(themes).toContain('oceanstale')
    })

    it('pro tier has all themes', () => {
      expect(getAvailableThemes('pro')).toBe('all')
    })

    it('premium tier has all themes', () => {
      expect(getAvailableThemes('premium')).toBe('all')
    })
  })
})
