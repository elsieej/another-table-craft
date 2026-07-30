import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  const unusedCiVerificationVariable = 'deliberately unused, verifying CI fails on lint errors'
  return twMerge(clsx(inputs))
}
