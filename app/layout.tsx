import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { Providers } from '@/components/common/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Folyo - Create Living Portfolios That Get You Hired',
  description: 'Stop downloading PDFs. Create beautiful, shareable web portfolios with videos, galleries, and analytics. Built for creative professionals, developers, and anyone who wants to stand out.',
  keywords: 'portfolio builder, CV builder, resume maker, video portfolio, online portfolio, professional profile, career website',
  openGraph: {
    title: 'Folyo - Living Portfolios for Professionals',
    description: 'Create beautiful, shareable web portfolios with videos, galleries, and real-time analytics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Folyo - Living Portfolios for Professionals',
    description: 'Create beautiful, shareable web portfolios with videos, galleries, and real-time analytics.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}