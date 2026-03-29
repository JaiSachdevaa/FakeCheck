import { MODELS } from '@/data/constants'
import type { ModelId } from '@/types'
import { cn } from '@/types/lib/utils'

interface ModelSelectorProps {
  selected: ModelId
  onChange: (id: ModelId) => void
}

export function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest px-1">
        Classifier
      </p>
      <div className="grid grid-cols-1 gap-2">
        {MODELS.map(model => {
          const isSelected = selected === model.id
          return (
            <button
              key={model.id}
              onClick={() => onChange(model.id)}
              className={cn(
                'w-full text-left rounded-xl border px-3.5 py-3 transition-all duration-150 group',
                isSelected
                  ? 'bg-surface-800 border-surface-600 shadow-sm'
                  : 'bg-surface-900/40 border-surface-800 hover:bg-surface-800/60 hover:border-surface-700'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                  style={{
                    backgroundColor: isSelected ? model.color + '22' : '#1c1917',
                    color: model.color,
                    border: `1px solid ${model.color}44`,
                  }}
                >
                  {model.short}
                </div>
                <div className="flex-1 min-w-0">
                  {/* No accuracy % shown here */}
                  <span className={cn(
                    'text-sm font-medium transition-colors block',
                    isSelected ? 'text-surface-100' : 'text-surface-300 group-hover:text-surface-200'
                  )}>
                    {model.label}
                  </span>
                  <span className="text-[11px] text-surface-500">{model.description}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}