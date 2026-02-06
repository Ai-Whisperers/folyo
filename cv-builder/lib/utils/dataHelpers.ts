/**
 * Utility functions for efficient data manipulation
 */

/**
 * Efficient deep clone for plain objects
 * More performant than JSON.parse(JSON.stringify()) for most use cases
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  // Handle Array objects
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }

  // Handle plain objects
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  // For other objects, fall back to JSON method
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Efficient object update with path-based property access
 * Avoids deep cloning for simple updates
 */
export function setNestedValue<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')
  const result = { ...obj }
  let current: any = result

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    // Handle array indices
    const nextKey = keys[i + 1]
    const isNextArray = !isNaN(Number(nextKey))

    if (!current[key]) {
      current[key] = isNextArray ? [] : {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
  return result
}

/**
 * Efficient array update with index-based access
 */
export function updateArrayItem<T>(
  array: T[], 
  index: number, 
  updater: (item: T) => T
): T[] {
  if (index < 0 || index >= array.length) {
    return array
  }

  const result = [...array]
  result[index] = updater(result[index])
  return result
}

/**
 * Efficient array item removal
 */
export function removeArrayItem<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    return array
  }

  return array.filter((_, i) => i !== index)
}

/**
 * Efficient array item addition
 */
export function addArrayItem<T>(array: T[], item: T): T[] {
  return [...array, item]
}