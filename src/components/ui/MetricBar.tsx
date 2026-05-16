import { cn } from '@/types/lib/utils'

interface MetricBarProps {
  label: string
  value: number
  color?: string
  className?: string
}

export function MetricBar({ label, value, color = '#22c55e', className }: MetricBarProps) {
  return (
    <div className={cn('group', className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-surface-400 group-hover:text-surface-300 transition-colors">{label}</span>
        <span className="text-xs font-mono font-medium text-surface-200">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
