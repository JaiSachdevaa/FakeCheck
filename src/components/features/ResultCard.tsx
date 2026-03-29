import { Badge } from '@/components/ui/Badge'
import { ConfidenceRing } from '@/components/ui/ConfidenceRing'
import { MODELS, MODEL_METRICS } from '@/data/constants'
import type { PredictionResult } from '@/types'
import { cn } from '@/types/lib/utils'

interface ResultCardProps {
  result: PredictionResult
}

const FAKE_EXPLANATIONS = [
  'Contains common misinformation patterns and unverified claims.',
  'Sensational language and emotional manipulation detected.',
  'High density of fear-inducing or conspiratorial language.',
]

const REAL_EXPLANATIONS = [
  'Language consistent with credible, fact-based reporting.',
  'Contains attributed sources and measured factual tone.',
  'Journalistic patterns and institutional references detected.',
]

export function ResultCard({ result }: ResultCardProps) {
  const model   = MODELS.find(m => m.id === result.modelId)!
  const metrics = MODEL_METRICS[result.modelId]

  const explanationIdx = Math.min(Math.floor(result.confidence / 34), 2)
  const explanation = result.isFake
    ? FAKE_EXPLANATIONS[explanationIdx]
    : REAL_EXPLANATIONS[explanationIdx]

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 animate-fade-up space-y-4 shadow-lg',
        result.isFake
          ? 'bg-danger-950/80 border-danger-700/60'
          : 'bg-brand-950/80 border-brand-700/60'
      )}
    >
      {/* ── Top row: ring + verdict ── */}
      <div className="flex items-start gap-5">
        <ConfidenceRing confidence={result.confidence} isFake={result.isFake} size={110} />

        <div className="flex-1 pt-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={result.isFake ? 'fake' : 'real'} size="md">
              {result.isFake ? '⚠ FAKE' : '✓ REAL'}
            </Badge>
            <Badge variant="neutral" size="sm">
              {model.short} · {model.label}
            </Badge>
            {result.source === 'mock' && (
              <Badge variant="outline" size="sm">⚡ local mock</Badge>
            )}
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

      {/* ── Selected model metrics only ── */}
      <div className={cn(
        'pt-4 border-t',
        result.isFake ? 'border-danger-800/40' : 'border-brand-800/40'
      )}>
        <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest mb-3">
          {model.label} — model accuracy
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Accuracy',  value: metrics.accuracy },
            { label: 'Precision', value: metrics.precision },
            { label: 'Recall',    value: metrics.recall },
            { label: 'F1 Score',  value: metrics.f1 },
          ].map(stat => (
            <div
              key={stat.label}
              className={cn(
                'rounded-xl px-3 py-2.5 border text-center',
                result.isFake
                  ? 'bg-danger-900/30 border-danger-800/40'
                  : 'bg-brand-900/30 border-brand-800/40'
              )}
            >
              <div className={cn(
                'text-[11px] font-mono font-semibold',
                result.isFake ? 'text-danger-300' : 'text-brand-300'
              )}>
                {stat.value.toFixed(1)}%
              </div>
              <div className="text-[10px] text-surface-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── All-model comparison (real API only) ── */}
      {result.allResults && (
        <div className={cn(
          'pt-4 border-t',
          result.isFake ? 'border-danger-800/40' : 'border-brand-800/40'
        )}>
          <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest mb-3">
            All classifiers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MODELS.map(m => {
              const r = result.allResults![m.id]
              return (
                <div
                  key={m.id}
                  className={cn(
                    'rounded-xl px-3 py-2.5 border text-center',
                    r.isFake
                      ? 'bg-danger-900/30 border-danger-800/40'
                      : 'bg-brand-900/30 border-brand-800/40'
                  )}
                >
                  <div className="text-[10px] font-bold mb-1" style={{ color: m.color }}>
                    {m.short}
                  </div>
                  <div className={cn(
                    'text-xs font-semibold',
                    r.isFake ? 'text-danger-300' : 'text-brand-300'
                  )}>
                    {r.label}
                  </div>
                  <div className="text-[10px] font-mono text-surface-400 mt-0.5">
                    {r.confidence.toFixed(1)}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Signal tags (mock only) ── */}
      {result.signals.length > 0 && (
        <div className={cn(
          'pt-4 border-t',
          result.isFake ? 'border-danger-800/40' : 'border-brand-800/40'
        )}>
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
                    ? 'bg-danger-900/40 border-danger-800/40 text-danger-400'
                    : 'bg-brand-900/40 border-brand-800/40 text-brand-400'
                )}
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <p className="text-[11px] text-surface-600 leading-relaxed">
        {result.source === 'api'
          ? 'Prediction from trained ML model. Always verify news with trusted sources.'
          : '⚡ Flask API offline — using local heuristic mock. Start the backend for real ML predictions.'}
      </p>
    </div>
  )
}