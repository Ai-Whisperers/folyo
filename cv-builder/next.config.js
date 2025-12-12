/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Backend server
      },
    ]
  },
  env: {
    JEKYLL_TEMPLATE_PATH: '../',
    CUSTOM_KEY: 'cv-builder-service',
  },
}

module.exports = nextConfig