import Link from 'next/link'

export default function PortfolioNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Portfolio Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          This portfolio doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Create Your Portfolio
        </Link>
      </div>
    </div>
  )
}
