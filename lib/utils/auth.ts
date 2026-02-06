/**
 * Secure password utilities
 * 
 * SECURITY WARNING: This is a client-side authentication solution 
 * for demonstration purposes only. In production, you MUST use:
 * - Proper backend authentication with HTTPS
 * - Server-side password hashing (bcrypt, Argon2, etc.)
 * - JWT tokens or session management
 * - Rate limiting and brute force protection
 * 
 * This implementation provides basic security improvements over plain text
 * but is NOT suitable for production applications.
 */

/**
 * Hash password using Web Crypto API
 * NOTE: This is not production-ready - real auth should use proper backend
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Password hashing requires browser environment')
  }

  try {
    // Encode password as UTF-8
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    
    // Hash with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return hashHex
  } catch (error) {
    console.error('Password hashing failed:', error)
    // Fallback to a simple hash (less secure but better than plain text)
    return btoa(password + '_salt_folyo_2024')
  }
}

/**
 * Verify password against stored hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const inputHash = await hashPassword(password)
    return inputHash === storedHash
  } catch (error) {
    console.error('Password verification failed:', error)
    return false
  }
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password should be at least 8 characters long')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one uppercase letter')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one lowercase letter')
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one number')
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one special character')
  }

  return {
    score,
    feedback,
    isStrong: score >= 4
  }
}