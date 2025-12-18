const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cv-builder'

// Track database connection status
let dbConnected = false

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // Skip if explicitly disabled
  if (process.env.SKIP_DB === 'true') {
    console.log('⚠️  Database connection skipped (SKIP_DB=true)')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully')
      dbConnected = true
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB Connection Error:', error.message)
      console.log('⚠️  Running without database - some features will be disabled')
      dbConnected = false
      return null
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    dbConnected = false
    return null
  }

  return cached.conn
}

function isDbConnected() {
  return dbConnected
}

module.exports = { connectDB, isDbConnected }