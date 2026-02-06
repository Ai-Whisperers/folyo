/**
 * Input validation and sanitization utilities
 */

/**
 * Common validation rules
 */
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes'
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
    message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
  },
  url: {
    required: false,
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    message: 'Please enter a valid URL (https://www.example.com)'
  },
  phone: {
    required: false,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  }
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: string
}

/**
 * Validate email address
 */
export function validateEmail(emailInput: string): ValidationResult {
  const email = emailInput.trim().toLowerCase()
  const errors: string[] = []

  if (!email) {
    errors.push('Email is required')
  } else if (!VALIDATION_RULES.email.pattern.test(email)) {
    errors.push(VALIDATION_RULES.email.message)
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: email
  }
}

/**
 * Validate name
 */
export function validateName(name: string): ValidationResult {
  const trimmedName = name.trim()
  const errors: string[] = []

  if (!trimmedName) {
    errors.push('Name is required')
  } else {
    if (trimmedName.length < VALIDATION_RULES.name.minLength) {
      errors.push('Name must be at least 2 characters long')
    }
    if (trimmedName.length > VALIDATION_RULES.name.maxLength) {
      errors.push('Name must be less than 100 characters')
    }
    if (!VALIDATION_RULES.name.pattern.test(trimmedName)) {
      errors.push(VALIDATION_RULES.name.message)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: trimmedName
  }
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const trimmedPhone = phone.trim()
  const errors: string[] = []

  if (trimmedPhone && !VALIDATION_RULES.phone.pattern.test(trimmedPhone)) {
    errors.push(VALIDATION_RULES.phone.message)
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: trimmedPhone
  }
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationResult {
  const trimmedUrl = url.trim()
  const errors: string[] = []

  if (trimmedUrl && !VALIDATION_RULES.url.pattern.test(trimmedUrl)) {
    errors.push(VALIDATION_RULES.url.message)
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: trimmedUrl
  }
}

/**
 * Sanitize text input (basic XSS protection)
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return ''
  
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove JavaScript protocols
    .replace(/javascript:/gi, '')
    // Remove data URLs
    .replace(/data:/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Validate and sanitize CV field data
 */
export function validateCVField(fieldName: string, value: string): ValidationResult {
  const sanitizedValue = sanitizeText(value)
  const errors: string[] = []

  // Common validation for most text fields
  if (sanitizedValue.length > 2000) {
    errors.push('Text field cannot exceed 2000 characters')
  }

  // Field-specific validation
  switch (fieldName) {
    case 'sidebar.name':
    case 'sidebar.tagline':
      if (!sanitizedValue) {
        errors.push(`${fieldName} is required`)
      }
      break
    
    case 'sidebar.email':
      if (sanitizedValue && !VALIDATION_RULES.email.pattern.test(sanitizedValue)) {
        errors.push('Please enter a valid email address')
      }
      break
    
    case 'sidebar.phone':
      if (sanitizedValue && !VALIDATION_RULES.phone.pattern.test(sanitizedValue)) {
        errors.push('Please enter a valid phone number')
      }
      break
    
    case 'sidebar.website':
    case 'sidebar.linkedin':
    case 'sidebar.github':
      if (sanitizedValue && !VALIDATION_RULES.url.pattern.test(sanitizedValue)) {
        errors.push('Please enter a valid URL')
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue
  }
}

/**
 * Validate entire CV data object
 */
export function validateCVData(data: any): {
  isValid: boolean
  errors: Record<string, string[]>
  sanitizedData: any
} {
  const errors: Record<string, string[]> = {}
  let sanitizedData = { ...data }

  // Validate personal info
  if (!data.sidebar?.name) {
    errors['sidebar.name'] = ['Name is required']
  } else {
    const nameValidation = validateName(data.sidebar.name)
    if (!nameValidation.isValid) {
      errors['sidebar.name'] = nameValidation.errors
    }
    sanitizedData.sidebar = { ...sanitizedData.sidebar, name: nameValidation.sanitizedValue }
  }

  if (data.sidebar?.email) {
    const emailValidation = validateEmail(data.sidebar.email)
    if (!emailValidation.isValid) {
      errors['sidebar.email'] = emailValidation.errors
    }
    sanitizedData.sidebar = { ...sanitizedData.sidebar, email: emailValidation.sanitizedValue }
  }

  // Validate phone if provided
  if (data.sidebar?.phone) {
    const phoneValidation = validatePhone(data.sidebar.phone)
    if (!phoneValidation.isValid) {
      errors['sidebar.phone'] = phoneValidation.errors
    }
    sanitizedData.sidebar = { ...sanitizedData.sidebar, phone: phoneValidation.sanitizedValue }
  }

  // Validate URLs if provided
  ['website', 'linkedin', 'github'].forEach(field => {
    if (data.sidebar?.[field]) {
      const urlValidation = validateUrl(data.sidebar[field])
      if (!urlValidation.isValid) {
        errors[`sidebar.${field}`] = urlValidation.errors
      }
      sanitizedData.sidebar = { ...sanitizedData.sidebar, [field]: urlValidation.sanitizedValue }
    }
  })

  // Sanitize all text fields
  const fieldsToSanitize = [
    'career_profile.summary',
    'career-profile.summary',
    'sidebar.tagline'
  ]

  fieldsToSanitize.forEach(fieldPath => {
    const value = getFieldByPath(data, fieldPath)
    if (value && typeof value === 'string') {
      const sanitized = sanitizeText(value)
      sanitizedData = setFieldByPath(sanitizedData, fieldPath, sanitized)
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  }
}

/**
 * Helper to get nested field value by path
 */
function getFieldByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Helper to set nested field value by path
 */
function setFieldByPath(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const result = { ...obj }
  let current: any = result

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }

  current[keys[keys.length - 1]] = value
  return result
}