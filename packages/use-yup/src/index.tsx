import { useState, useEffect, useCallback, useRef } from 'react'
import { Schema } from 'yup'

export type Values = {
  [field: string]: any
}

export type ValidationErrors<T> = {
  [K in keyof T]?: T[K] extends object ? ValidationErrors<T[K]> : string
}

type ValidationResult<T> = {
  errors: ValidationErrors<T>
  isValid: boolean
}

type UseYupOptions = {
  validateOnChange?: boolean
}

export const useYup = <T extends Values>(
  values: T,
  validationSchema: Schema<any>,
  options: UseYupOptions = {}
) => {
  const validatedOnce = useRef(false)
  const [errors, setErrors] = useState<ValidationErrors<T>>({})
  const isValid = validatedOnce.current ? Object.keys(errors).length === 0 : undefined

  const validate = useCallback(
    (options: { updateErrors?: boolean } = {}) => {
      const updateErrors = options.updateErrors ?? true
      return validationSchema
        .validate(values, { abortEarly: false })
        .then(() => {
          return {} as ValidationErrors<T>
        })
        .catch((error: any) => {
          return yupToValidationErrors<T>(error)
        })
        .then(newErrors => {
          validatedOnce.current = true
          if (updateErrors) {
            setErrors(newErrors)
          }
          return {
            errors: newErrors,
            isValid: Object.keys(newErrors).length === 0,
          } as ValidationResult<T>
        })
    },
    [validationSchema, values]
  )

  useEffect(() => {
    options.validateOnChange && validate()
  }, [options.validateOnChange, validate])

  return {
    validate,
    errors,
    isValid,
    validatedOnce: validatedOnce.current,
  }
}

/* eslint-disable func-style */

/**
 * Transform Yup errors to a ValidationErrors object
 */
function yupToValidationErrors<T extends Values>(yupError: any): ValidationErrors<T> {
  let errors: any = {} as ValidationErrors<Values>
  if (yupError.inner.length === 0) {
    updateIn(errors, yupError.path, yupError.message)
    return errors
  }
  for (let err of yupError.inner) {
    updateIn(errors, err.path, err.message)
  }
  return errors
}

function updateIn(obj: any, path: string, value: any): any {
  const pathArray = path.split('.')
  let destinationObject = obj
  for (let i = 0; i < pathArray.length - 1; i++) {
    if (pathArray[i] in destinationObject === false) {
      destinationObject[pathArray[i]] = {}
    }
    destinationObject = destinationObject[pathArray[i]]
  }
  destinationObject[pathArray[pathArray.length - 1]] = value
}

export default useYup
