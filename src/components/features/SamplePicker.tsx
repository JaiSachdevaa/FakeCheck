import { SAMPLE_ARTICLES } from '@/data/constants'
import { cn } from '@/types/lib/utils'

interface SamplePickerProps {
  onSelect: (text: string) => void
}

export function SamplePicker({ onSelect }: SamplePickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest">
        Try a sample
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_ARTICLES.map(article => (
          <button
            key={article.id}
            onClick={() => onSelect(article.text)}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border',
              'transition-all duration-150 font-medium',
              article.label === 'Fake'
                ? 'border-danger-800/60 text-danger-400 hover:bg-danger-900/30 hover:border-danger-700'
                : 'border-brand-800/60 text-brand-400 hover:bg-brand-900/30 hover:border-brand-700'
            )}
          >
            <span className={cn(
              'w-1.5 h-1.5 rounded-full flex-shrink-0',
              article.label === 'Fake' ? 'bg-danger-500' : 'bg-brand-500'
            )} />
            {article.label} #{article.id}
          </button>
        ))}
      </div>
    </div>
  )
}
