const QRCode = require('qrcode')

/**
 * QR Code generation utility for portfolio URLs
 */

// Theme color mapping for QR codes
const THEME_COLORS = {
  blue: '#2E86AB',
  turquoise: '#17a2b8',
  green: '#28a745',
  berry: '#8e44ad',
  orange: '#fd7e14',
  ceramic: '#d4926d',
  teal: '#20c997',
  oceanstale: '#6c757d'
}

/**
 * Generate QR code as data URL
 * @param {string} url - The URL to encode
 * @param {object} options - QR code options
 * @returns {Promise<string>} Base64 data URL of the QR code
 */
async function generateQRCodeDataURL(url, options = {}) {
  const {
    width = 200,
    margin = 2,
    theme = null,
    darkColor = '#000000',
    lightColor = '#FFFFFF',
    errorCorrectionLevel = 'M'
  } = options

  // Use theme color if specified
  const dark = theme && THEME_COLORS[theme] ? THEME_COLORS[theme] : darkColor

  try {
    const dataURL = await QRCode.toDataURL(url, {
      width,
      margin,
      color: {
        dark,
        light: lightColor
      },
      errorCorrectionLevel
    })
    return dataURL
  } catch (error) {
    console.error('QR Code generation error:', error)
    throw error
  }
}

/**
 * Generate QR code as PNG buffer
 * @param {string} url - The URL to encode
 * @param {object} options - QR code options
 * @returns {Promise<Buffer>} PNG buffer of the QR code
 */
async function generateQRCodeBuffer(url, options = {}) {
  const {
    width = 200,
    margin = 2,
    theme = null,
    darkColor = '#000000',
    lightColor = '#FFFFFF',
    errorCorrectionLevel = 'M'
  } = options

  const dark = theme && THEME_COLORS[theme] ? THEME_COLORS[theme] : darkColor

  try {
    const buffer = await QRCode.toBuffer(url, {
      type: 'png',
      width,
      margin,
      color: {
        dark,
        light: lightColor
      },
      errorCorrectionLevel
    })
    return buffer
  } catch (error) {
    console.error('QR Code buffer generation error:', error)
    throw error
  }
}

/**
 * Generate QR code as SVG string
 * @param {string} url - The URL to encode
 * @param {object} options - QR code options
 * @returns {Promise<string>} SVG string of the QR code
 */
async function generateQRCodeSVG(url, options = {}) {
  const {
    width = 200,
    margin = 2,
    theme = null,
    darkColor = '#000000',
    lightColor = '#FFFFFF'
  } = options

  const dark = theme && THEME_COLORS[theme] ? THEME_COLORS[theme] : darkColor

  try {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      width,
      margin,
      color: {
        dark,
        light: lightColor
      }
    })
    return svg
  } catch (error) {
    console.error('QR Code SVG generation error:', error)
    throw error
  }
}

/**
 * Build portfolio URL from slug
 * @param {string} slug - Portfolio slug
 * @param {string} baseUrl - Base URL of the application
 * @returns {string} Full portfolio URL
 */
function buildPortfolioURL(slug, baseUrl) {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base.replace(/\/$/, '')}/portfolio/${slug}`
}

module.exports = {
  generateQRCodeDataURL,
  generateQRCodeBuffer,
  generateQRCodeSVG,
  buildPortfolioURL,
  THEME_COLORS
}
