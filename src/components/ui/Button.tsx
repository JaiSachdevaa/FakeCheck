import { cn } from '@/types/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
        'disabled:pointer-events-none disabled:opacity-40',
        size === 'sm' && 'text-sm px-3 py-1.5',
        size === 'md' && 'text-sm px-4 py-2.5',
        size === 'lg' && 'text-base px-6 py-3',
        variant === 'primary' && 'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-sm hover:shadow-glow-green',
        variant === 'secondary' && 'bg-surface-800 hover:bg-surface-700 active:bg-surface-800 text-surface-100 border border-surface-700',
        variant === 'ghost' && 'hover:bg-surface-800 active:bg-surface-900 text-surface-300 hover:text-surface-100',
        variant === 'danger' && 'bg-danger-700 hover:bg-danger-600 text-white',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin-slow h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}
