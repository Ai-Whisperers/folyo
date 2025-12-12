import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Professional CV Builder - Create Your Perfect Resume',
  description: 'Build professional CVs and resumes with our intuitive online builder. Choose from beautiful templates, real-time preview, and export to multiple formats.',
  keywords: 'CV builder, resume maker, professional CV, online resume builder, job application, career',
}

import { Providers } from '../components/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <div className="min-h-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}