'use client'

import { forwardRef, useState } from 'react'
import { validateEmail, validateName, validatePhone, validateUrl, ValidationResult } from '@/lib/utils/validation'

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  validationType?: 'email' | 'name' | 'phone' | 'url' | 'text'
  showValidation?: boolean
  onValidationChange?: (result: ValidationResult) => void
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    label, 
    error: externalError, 
    validationType = 'text',
    showValidation = true,
    onValidationChange,
    onChange,
    onBlur,
    value,
    className = '',
    ...props 
  }, ref) => {
    const [touched, setTouched] = useState(false)
    const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: [] })

    const validateValue = (inputValue: string) => {
      let result: ValidationResult

      switch (validationType) {
        case 'email':
          result = validateEmail(inputValue)
          break
        case 'name':
          result = validateName(inputValue)
          break
        case 'phone':
          result = validatePhone(inputValue)
          break
        case 'url':
          result = validateUrl(inputValue)
          break
        default:
          result = { isValid: true, errors: [] }
      }

      setValidationResult(result)
      onValidationChange?.(result)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      validateValue(newValue)
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      validateValue(e.target.value)
      onBlur?.(e)
    }

    const hasError = externalError || (touched && showValidation && !validationResult.isValid)
    const errorMessage = externalError || (touched && validationResult.errors[0])

    return (
      <div className="space-y-1">
        {label && (
          <label className="form-label text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            form-input
            ${hasError ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          {...props}
        />
        {hasError && errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'