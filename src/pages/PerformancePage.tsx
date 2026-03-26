import { PerformanceChart } from '@/components/features/PerformanceChart'
import { MODEL_METRICS, MODELS } from '@/data/constants'

export function PerformancePage() {
  const best = MODELS.reduce((a, b) =>
    MODEL_METRICS[a.id].accuracy > MODEL_METRICS[b.id].accuracy ? a : b
  )

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

      {/* Best model callout */}
      <div
        className="mb-8 rounded-2xl border p-4 flex items-center gap-4"
        style={{
          background: best.color + '10',
          borderColor: best.color + '30',
        }}
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
            Achieved {MODEL_METRICS[best.id].accuracy}% accuracy — recommended for production use.
          </p>
        </div>
        <div className="ml-auto font-mono text-2xl font-bold" style={{ color: best.color }}>
          {MODEL_METRICS[best.id].accuracy}%
        </div>
      </div>

      <PerformanceChart />

      {/* Metrics table */}
      <div className="mt-8 glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-800">
          <h3 className="text-sm font-semibold text-surface-200">Full metrics table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                {['Model', 'Accuracy', 'Precision', 'Recall', 'F1', 'Train time', 'Params'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-surface-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODELS.sort((a, b) => MODEL_METRICS[b.id].accuracy - MODEL_METRICS[a.id].accuracy)
                .map((model, i) => {
                  const m = MODEL_METRICS[model.id]
                  return (
                    <tr
                      key={model.id}
                      className={i % 2 === 0 ? 'bg-surface-900/20' : ''}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                            style={{ background: model.color + '20', color: model.color }}
                          >
                            {model.short}
                          </span>
                          <span className="text-surface-200 font-medium">{model.label}</span>
                        </div>
                      </td>
                      {[m.accuracy, m.precision, m.recall, m.f1].map((val, j) => (
                        <td key={j} className="px-4 py-3 font-mono text-surface-300">
                          {val.toFixed(1)}%
                        </td>
                      ))}
                      <td className="px-4 py-3 font-mono text-surface-400 text-xs">{m.trainTime}</td>
                      <td className="px-4 py-3 font-mono text-surface-400 text-xs">{m.parameters}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
