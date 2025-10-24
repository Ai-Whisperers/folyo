import { connectDB } from '../../../lib/database'
import User from '../../../models/User'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'

// Rate limiting for registration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 registration requests per windowMs
  message: {
    error: 'Too many registration attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const validationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Apply rate limiting
    await new Promise((resolve, reject) => {
      limiter(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        resolve(result)
      })
    })

    // Apply validation
    await Promise.all(validationRules.map(validation => validation.run(req)))
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      })
    }

    const { name, email, password } = req.body

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email' 
      })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      emailVerified: false,
      preferences: {
        defaultTheme: 'teal'
      }
    })

    // Remove password from response
    const userResponse = user.toJSON()
    delete userResponse.password

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'User already exists with this email' 
      })
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }))
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      })
    }

    res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    })
  }
}