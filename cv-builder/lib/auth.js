import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from './database'
import User from '../models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        try {
          await connectDB()
          
          const user = await User.findOne({ email: credentials.email })
            .select('+password')
          
          if (!user) {
            throw new Error('No user found with this email')
          }

          if (!user.isActive) {
            throw new Error('Your account has been deactivated')
          }

          const isValid = await user.comparePassword(credentials.password)
          
          if (!isValid) {
            throw new Error('Invalid password')
          }

          // Update last login
          await user.updateLastLogin()

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.profilePicture,
            role: user.role,
            subscription: user.subscription,
            emailVerified: user.emailVerified
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectDB()
          
          // Check if user already exists
          let existingUser = await User.findOne({ email: user.email })
          
          if (existingUser) {
            // Update user info from Google
            existingUser.name = user.name
            existingUser.profilePicture = user.image
            existingUser.emailVerified = true
            existingUser.lastLogin = new Date()
            await existingUser.save()
          } else {
            // Create new user
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              profilePicture: user.image,
              emailVerified: true,
              password: 'google-oauth-' + Date.now(), // Placeholder password
              lastLogin: new Date()
            })
          }

          user.id = existingUser._id.toString()
          user.role = existingUser.role
          user.subscription = existingUser.subscription
          
          return true
        } catch (error) {
          console.error('Google sign in error:', error)
          return false
        }
      }
      
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.subscription = user.subscription
        token.emailVerified = user.emailVerified
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.subscription = token.subscription
        session.user.emailVerified = token.emailVerified
      }
      return session
    }
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)