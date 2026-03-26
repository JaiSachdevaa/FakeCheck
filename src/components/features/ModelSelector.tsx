import { cn } from '@/lib/utils'
import { MODEL_METRICS, MODELS } from '@/data/constants'
import type { ModelId } from '@/types'

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
          const metrics = MODEL_METRICS[model.id]
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
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'text-sm font-medium transition-colors',
                      isSelected ? 'text-surface-100' : 'text-surface-300 group-hover:text-surface-200'
                    )}>
                      {model.label}
                    </span>
                    <span
                      className="text-[11px] font-mono font-medium"
                      style={{ color: model.color }}
                    >
                      {metrics.accuracy}%
                    </span>
                  </div>
                  <span className="text-[11px] text-surface-500">{model.description}</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2.5 pt-2.5 border-t border-surface-700 grid grid-cols-3 gap-2">
                  {[
                    { label: 'F1', value: metrics.f1 },
                    { label: 'Prec', value: metrics.precision },
                    { label: 'Rec', value: metrics.recall },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="text-[10px] text-surface-500 mb-0.5">{stat.label}</div>
                      <div className="text-xs font-mono font-medium text-surface-200">
                        {stat.value.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
