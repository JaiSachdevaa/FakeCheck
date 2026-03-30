import { PerformanceChart } from '@/components/features/PerformanceChart'
import { MODEL_METRICS, MODELS } from '@/data/constants'
import type { PredictionResult } from '@/types'
import { cn } from '@/types/lib/utils'

function getStoredResult(): PredictionResult | null {
  try {
    const raw = localStorage.getItem('fakecheck_last_result')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    parsed.timestamp = new Date(parsed.timestamp)
    return parsed as PredictionResult
  } catch {
    return null
  }
}

export function PerformancePage() {
  const best = MODELS.reduce((a, b) =>
    MODEL_METRICS[a.id].accuracy > MODEL_METRICS[b.id].accuracy ? a : b
  )

  const lastResult  = getStoredResult()
  const lastModel   = lastResult ? MODELS.find(m => m.id === lastResult.modelId) : null
  const lastMetrics = lastResult ? MODEL_METRICS[lastResult.modelId] : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-surface-50">
          Model performance
        </h1>
        <p className="mt-2 text-surface-400 text-sm leading-relaxed">
          Evaluation results across four classifiers trained on the fake news dataset.
          Metrics computed on a 20% held-out test split.
        </p>
      </div>

      {/* Last article result banner */}
      {lastResult && lastModel && lastMetrics ? (
        <div
          className={cn(
            'mb-8 rounded-2xl border p-5 space-y-4',
            lastResult.isFake
              ? 'bg-danger-950/80 border-danger-700/60'
              : 'bg-brand-950/80 border-brand-700/60'
          )}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest mb-1">
                Last analysed article
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: lastModel.color + '20', color: lastModel.color, border: `1px solid ${lastModel.color}40` }}
                >
                  {lastModel.short}
                </div>
                <span className="text-sm font-semibold text-surface-100">{lastModel.label}</span>
                <span
                  className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    lastResult.isFake
                      ? 'bg-danger-900/60 text-danger-300'
                      : 'bg-brand-900/60 text-brand-300'
                  )}
                >
                  {lastResult.isFake ? '⚠ FAKE' : '✓ REAL'}
                </span>
                {lastResult.source === 'mock' && (
                  <span className="text-[11px] text-surface-500 font-mono">⚡ mock</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl font-bold" style={{ color: lastModel.color }}>
                {lastResult.confidence}%
              </div>
              <div className="text-[11px] text-surface-500">confidence</div>
            </div>
          </div>

          {/* Metrics for the model that was used */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Accuracy',  value: lastMetrics.accuracy },
              { label: 'Precision', value: lastMetrics.precision },
              { label: 'Recall',    value: lastMetrics.recall },
              { label: 'F1 Score',  value: lastMetrics.f1 },
            ].map(stat => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl px-3 py-2.5 border text-center',
                  lastResult.isFake
                    ? 'bg-danger-900/30 border-danger-800/40'
                    : 'bg-brand-900/30 border-brand-800/40'
                )}
              >
                <div className="text-[11px] font-mono font-semibold" style={{ color: lastModel.color }}>
                  {stat.value.toFixed(1)}%
                </div>
                <div className="text-[10px] text-surface-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* All classifiers comparison */}
          {lastResult.allResults && (
            <div className={cn('pt-3 border-t', lastResult.isFake ? 'border-danger-800/40' : 'border-brand-800/40')}>
              <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest mb-3">
                All classifiers on this article
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MODELS.map(m => {
                  const r = lastResult.allResults![m.id]
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
                      <div className={cn('text-xs font-semibold', r.isFake ? 'text-danger-300' : 'text-brand-300')}>
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

          <p className="text-[11px] text-surface-600">
            Analysed {lastResult.timestamp.toLocaleString()} ·{' '}
            {lastResult.source === 'api' ? 'Live ML prediction' : 'Local mock (backend offline)'}
          </p>
        </div>
      ) : (
        /* No result yet — show default best model callout */
        <div
          className="mb-8 rounded-2xl border p-4 flex items-center gap-4"
          style={{ background: best.color + '10', borderColor: best.color + '30' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: best.color + '20', color: best.color, border: `1px solid ${best.color}40` }}
          >
            {best.short}
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-100">
              {best.label} is the top performer
            </p>
            <p className="text-xs text-surface-400 mt-0.5">
              Achieved {MODEL_METRICS[best.id].accuracy}% accuracy — analyse an article to see results here.
            </p>
          </div>
          <div className="ml-auto font-mono text-2xl font-bold" style={{ color: best.color }}>
            {MODEL_METRICS[best.id].accuracy}%
          </div>
        </div>
      )}

      {/* ↓ Pass allResults so charts update per article instead of showing static metrics */}
      <PerformanceChart allResults={lastResult?.allResults ?? null} />

      
     
    </div>
  )
}