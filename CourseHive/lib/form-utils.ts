import { z } from 'zod'

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Password validation (at least 8 chars, 1 uppercase, 1 number)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')

// File validation for uploads
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File must be less than 5MB')
    .refine(
      (file) => ['text/csv', 'application/json'].includes(file.type),
      'File must be CSV or JSON'
    ),
})

// Field selection validation
export const fieldSelectionSchema = z.object({
  field: z.enum(['Engineering', 'Law', 'Business', 'Medical']),
})

// Type selection validation
export const typeSelectionSchema = z.object({
  type: z.string().min(1, 'Please select or enter a specialization'),
})

// Interest validation
export const interestSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']),
})

// Utility to format validation errors
export function formatValidationError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    formatted[path] = err.message
  })
  return formatted
}

// Utility to validate and return typed data
export async function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> {
  try {
    const validated = await schema.parseAsync(data)
    return { success: true, data: validated as T }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationError(error) }
    }
    return { success: false, errors: { general: 'An error occurred' } }
  }
}
