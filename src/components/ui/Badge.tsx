import { cn } from '@/types/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'fake' | 'real' | 'neutral' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'neutral', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-medium rounded-md tracking-wide',
        size === 'sm' && 'text-[10px] px-1.5 py-0.5',
        size === 'md' && 'text-xs px-2 py-1',
        variant === 'fake'    && 'bg-danger-900/50 text-danger-300 border border-danger-700/50',
        variant === 'real'    && 'bg-brand-900/50 text-brand-300 border border-brand-700/50',
        variant === 'neutral' && 'bg-surface-800 text-surface-300 border border-surface-700',
        variant === 'outline' && 'border border-surface-600 text-surface-400',
        className
      )}
    >
      {children}
    </span>
  )
}
