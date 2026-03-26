import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts'
import { MODELS, MODEL_METRICS, PERFORMANCE_CHART_DATA } from '@/data/constants'
import { MetricBar } from '@/components/ui/MetricBar'

const METRICS_LIST = ['accuracy', 'precision', 'recall', 'f1'] as const

const RADAR_DATA = METRICS_LIST.map(metric => ({
  metric: metric.charAt(0).toUpperCase() + metric.slice(1),
  LR: MODEL_METRICS.lr[metric],
  DT: MODEL_METRICS.dt[metric],
  GB: MODEL_METRICS.gb[metric],
  RF: MODEL_METRICS.rf[metric],
}))

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-900 border border-surface-700 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-xs text-surface-400 mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }} />
          <span className="text-surface-300">{p.name}</span>
          <span className="text-surface-100 font-medium ml-auto pl-4">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export function PerformanceChart() {
  return (
    <div className="space-y-8">

      {/* Bar chart — accuracy comparison */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-surface-200 mb-4">Accuracy comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={PERFORMANCE_CHART_DATA} barSize={36} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#78716c', fontSize: 12, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis domain={[84, 98]} tick={{ fill: '#78716c', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#292524' }} />
            <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
              {PERFORMANCE_CHART_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-surface-200 mb-4">Multi-metric radar</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#292524" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#78716c', fontSize: 11, fontFamily: 'Syne' }} />
            {MODELS.map(model => (
              <Radar
                key={model.id}
                name={model.short}
                dataKey={model.short}
                stroke={model.color}
                fill={model.color}
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#78716c', paddingTop: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-model metric bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODELS.map(model => {
          const m = MODEL_METRICS[model.id]
          return (
            <div key={model.id} className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: model.color + '20', color: model.color, border: `1px solid ${model.color}40` }}
                >
                  {model.short}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-200">{model.label}</p>
                  <p className="text-[11px] text-surface-500">{m.trainTime} train · {m.parameters}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <MetricBar label="Accuracy"  value={m.accuracy}  color={model.color} />
                <MetricBar label="Precision" value={m.precision} color={model.color} />
                <MetricBar label="Recall"    value={m.recall}    color={model.color} />
                <MetricBar label="F1 Score"  value={m.f1}        color={model.color} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
