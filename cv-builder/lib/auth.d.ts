/**
 * NextAuth configuration declarations
 */

import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role?: string
      subscription?: {
        plan: string
        status: string
      }
      emailVerified?: boolean
    }
  }

  interface User {
    id: string
    role?: string
    subscription?: {
      plan: string
      status: string
    }
    emailVerified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    subscription?: {
      plan: string
      status: string
    }
    emailVerified?: boolean
  }
}
