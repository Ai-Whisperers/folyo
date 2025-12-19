'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PRICING_TIERS } from '@/lib/pricing'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      // 20% discount for yearly
      return Math.floor(monthlyPrice * 12 * 0.8)
    }
    return monthlyPrice
  }

  const getPriceLabel = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 'Free'
    if (billingCycle === 'yearly') {
      return `$${getPrice(monthlyPrice)}/year`
    }
    return `$${monthlyPrice}/month`
  }

  const features = [
    { key: 'maxPortfolios', label: 'Portfolios' },
    { key: 'maxStorage', label: 'Storage', suffix: ' MB' },
    { key: 'themes', label: 'Themes' },
    { key: 'aiBuilder', label: 'AI Content Builder' },
    { key: 'videoPortfolio', label: 'Video Portfolio' },
    { key: 'analytics', label: 'Analytics Dashboard' },
    { key: 'pdfExport', label: 'PDF Export' },
    { key: 'qrCode', label: 'QR Code Sharing' },
    { key: 'customSlug', label: 'Custom URL Slug' },
    { key: 'subdomain', label: 'Personal Subdomain' },
    { key: 'customDomain', label: 'Custom Domain' },
    { key: 'removeWatermark', label: 'Remove Watermark' }
  ]

  const getFeatureValue = (tierKey: string, featureKey: string) => {
    const tier = PRICING_TIERS[tierKey]
    if (!tier) return null

    const value = tier.features[featureKey as keyof typeof tier.features]

    if (typeof value === 'boolean') {
      return value
    }
    if (value === 'all' || value === 'unlimited') {
      return 'Unlimited'
    }
    if (typeof value === 'number') {
      return value
    }
    if (Array.isArray(value)) {
      return value.length
    }
    return value
  }

  const renderFeatureValue = (value: boolean | string | number | null, suffix = '') => {
    if (value === true) {
      return <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
    }
    if (value === false) {
      return <XMarkIcon className="h-5 w-5 text-gray-300 mx-auto" />
    }
    if (value === 'Unlimited') {
      return <span className="text-teal-600 font-medium">Unlimited</span>
    }
    return <span className="text-gray-900">{value}{suffix}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              Folyo
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 font-semibold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(PRICING_TIERS).map(([key, tier]) => (
            <div
              key={key}
              className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
                tier.recommended
                  ? 'border-teal-500 ring-2 ring-teal-500 ring-opacity-50'
                  : 'border-gray-200'
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-6">{tier.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPriceLabel(tier.price)}
                  </span>
                  {tier.price > 0 && billingCycle === 'yearly' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Billed annually (${Math.floor(getPrice(tier.price) / 12)}/month)
                    </p>
                  )}
                </div>

                <Link
                  href={tier.price === 0 ? '/auth/signup' : `/auth/signup?plan=${key}`}
                  className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                    tier.recommended
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {tier.price === 0 ? 'Start Free' : 'Start Free Trial'}
                </Link>
              </div>

              <div className="px-8 pb-8">
                <p className="text-sm font-semibold text-gray-900 mb-4">Includes:</p>
                <ul className="space-y-3">
                  {features.slice(0, 6).map((feature) => {
                    const value = getFeatureValue(key, feature.key)
                    if (value === false) return null
                    return (
                      <li key={feature.key} className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>
                          {typeof value === 'number' || value === 'Unlimited'
                            ? `${value}${feature.suffix || ''} ${feature.label}`
                            : feature.label
                          }
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Feature Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Feature
                  </th>
                  {Object.entries(PRICING_TIERS).map(([key, tier]) => (
                    <th key={key} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature) => (
                  <tr key={feature.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{feature.label}</td>
                    {Object.keys(PRICING_TIERS).map((tierKey) => (
                      <td key={tierKey} className="px-6 py-4 text-center text-sm">
                        {renderFeatureValue(
                          getFeatureValue(tierKey, feature.key),
                          feature.suffix
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. Cancel anytime with no questions asked. Your data remains accessible until the billing period ends.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Join thousands of professionals showcasing their work with Folyo.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started for Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Folyo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
