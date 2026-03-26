import { Badge } from '@/components/ui/Badge'
import { ConfidenceRing } from '@/components/ui/ConfidenceRing'
import { MODELS } from '@/data/constants'
import { cn } from '@/lib/utils'
import type { PredictionResult } from '@/types'

interface ResultCardProps {
  result: PredictionResult
}

const FAKE_EXPLANATIONS = [
  'Sensational language and emotional manipulation detected.',
  'Contains common misinformation patterns and unverified claims.',
  'High density of fear-inducing or conspiratorial language.',
]

const REAL_EXPLANATIONS = [
  'Language consistent with credible, fact-based reporting.',
  'Contains attributed sources and measured factual tone.',
  'Journalistic patterns and institutional references detected.',
]

export function ResultCard({ result }: ResultCardProps) {
  const model = MODELS.find(m => m.id === result.modelId)!
  const explanation = result.isFake
    ? FAKE_EXPLANATIONS[Math.floor(result.confidence / 34)]
    : REAL_EXPLANATIONS[Math.floor(result.confidence / 34)]

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 animate-fade-up',
        result.isFake
          ? 'border-danger-800/70'
          : 'border-brand-800/70'
      )}
      style={{
        backgroundColor: result.isFake
          ? 'rgba(12, 3, 3, 0.97)'
          : 'rgba(2, 10, 6, 0.97)',
      }}
    >
      {/* Top row */}
      <div className="flex items-start gap-5">
        <ConfidenceRing
          confidence={result.confidence}
          isFake={result.isFake}
          size={110}
        />

        <div className="flex-1 pt-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={result.isFake ? 'fake' : 'real'} size="md">
              {result.isFake ? '⚠ FAKE' : '✓ REAL'}
            </Badge>
            <Badge variant="neutral" size="sm">
              {model.short} · {model.label}
            </Badge>
          </div>

          <h3 className={cn(
            'text-lg font-bold leading-snug',
            result.isFake ? 'text-danger-200' : 'text-brand-200'
          )}>
            {result.isFake ? 'Likely Fake News' : 'Likely Real News'}
          </h3>

          <p className={cn(
            'text-sm leading-relaxed',
            result.isFake ? 'text-danger-400' : 'text-brand-400'
          )}>
            {explanation}
          </p>
        </div>
      </div>

      {/* Signals */}
      {result.signals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-800/60">
          <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest mb-2">
            Detected signals
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.signals.map((signal, i) => (
              <span
                key={i}
                className={cn(
                  'text-[11px] font-mono px-2 py-0.5 rounded-md border',
                  signal.startsWith('⚠')
                    ? 'bg-danger-900/70 border-danger-800/60 text-danger-400'
                    : 'bg-brand-900/70 border-brand-800/60 text-brand-400'
                )}
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-3 text-[11px] text-surface-600 leading-relaxed">
        This is a machine learning prediction and may not be fully accurate. Always verify with trusted sources.
      </p>
    </div>
  )
}