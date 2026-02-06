'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { useAuth } from '@/lib/contexts/AuthContext'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onModeChange?: () => void
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fieldValidations, setFieldValidations] = useState<Record<string, { isValid: boolean; errors: string[] }>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors([])
  }

  const handleValidationChange = (field: string, result: { isValid: boolean; errors: string[] }) => {
    setFieldValidations(prev => ({ ...prev, [field]: result }))
  }

  const isFormValid = () => {
    const emailValid = fieldValidations.email?.isValid ?? true
    const passwordValid = fieldValidations.password?.isValid ?? true
    const nameValid = mode === 'signin' ? true : (fieldValidations.name?.isValid ?? true)
    
    return emailValid && passwordValid && nameValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    
    if (!isFormValid()) {
      setErrors(['Please fix the validation errors'])
      return
    }

    setIsLoading(true)

    try {
      let result
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password, formData.name)
      }

      if (result.success) {
        router.push('/dashboard')
      } else {
        setErrors([result.error || 'An error occurred'])
      }
    } catch (error) {
      setErrors(['An unexpected error occurred'])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <ValidatedInput
              label="Full Name"
              name="name"
              type="text"
              required
              validationType="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onValidationChange={(result) => handleValidationChange('name', result)}
            />
          )}

          <ValidatedInput
            label="Email Address"
            name="email"
            type="email"
            required
            validationType="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onValidationChange={(result) => handleValidationChange('email', result)}
          />

          <ValidatedInput
            label="Password"
            name="password"
            type="password"
            required
            validationType="text"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onValidationChange={(result) => handleValidationChange('password', result)}
            minLength={8}
          />

          <div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Sign up'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onModeChange}
            className="text-teal-600 hover:text-teal-500 text-sm font-medium"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  )
}