'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple storage key for users
const USERS_KEY = 'folyo-users'
const CURRENT_USER_KEY = 'folyo-current-user'

// Get stored users
const getStoredUsers = (): Record<string, { user: User; password: string }> => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Save users to storage
const saveUsers = (users: Record<string, { user: User; password: string }>) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Generate a simple unique ID
const generateId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY)
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getStoredUsers()
      const userRecord = users[email.toLowerCase()]

      if (!userRecord) {
        return { success: false, error: 'No account found with this email' }
      }

      if (userRecord.password !== password) {
        return { success: false, error: 'Incorrect password' }
      }

      setUser(userRecord.user)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userRecord.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getStoredUsers()

      if (users[email.toLowerCase()]) {
        return { success: false, error: 'An account with this email already exists' }
      }

      const newUser: User = {
        id: generateId(),
        email: email.toLowerCase(),
        name,
        createdAt: new Date().toISOString()
      }

      users[email.toLowerCase()] = { user: newUser, password }
      saveUsers(users)

      setUser(newUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An error occurred during sign up' }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))

    // Also update in users storage
    const users = getStoredUsers()
    if (users[user.email]) {
      users[user.email].user = updatedUser
      saveUsers(users)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
