import { MODELS, MODEL_METRICS, PERFORMANCE_CHART_DATA } from '@/data/constants'
import type { AllModelResults } from '@/types'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface Props {
  allResults?: AllModelResults | null
}

function CustomTooltip({ active, payload, label }: {
  active?:  boolean
  payload?: { name: string; value: number; color: string }[]
  label?:   string
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

function MetricCell({
  label,
  value,
  color,
  isText = false,
}: {
  label: string
  value: string
  color?: string
  isText?: boolean
}) {
  return (
    <div className="bg-surface-800/60 rounded-lg px-3 py-2">
      <div
        className="text-sm font-semibold font-mono"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
      <div className="text-[11px] text-surface-500 mt-0.5">{label}</div>
    </div>
  )
}

export function PerformanceChart({ allResults }: Props) {
  const isLive = !!allResults

  const barData = isLive
    ? MODELS.map(m => ({
        name:     m.short,
        accuracy: allResults[m.id].confidence,
        fill:     m.color,
      }))
    : PERFORMANCE_CHART_DATA

  return (
    <div className="space-y-6">

      {/* Bar chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-surface-200 mb-4">
          {isLive ? 'Confidence per model — this article' : 'Accuracy comparison'}
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={80} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#78716c', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={isLive ? [0, 100] : [96, 100]}
              tickCount={9}
              tick={{ fill: '#78716c', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#292524' }} />
            <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2×2 model cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODELS.map(model => {
          const m = MODEL_METRICS[model.id]

          return (
            <div key={model.id} className="glass-card p-4 space-y-3">

              {/* Header */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: model.color + '20', color: model.color, border: `1px solid ${model.color}40` }}
                >
                  {model.short}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-100">{model.label}</p>
                  <p className="text-[11px] text-surface-500">{m.trainTime} train · {m.parameters}</p>
                </div>
              </div>

              {/* Row 1: Accuracy · Precision · Recall */}
              <div className="grid grid-cols-3 gap-2">
                <MetricCell label="Accuracy"  value={`${m.accuracy.toFixed(1)}%`}  color={model.color} />
                <MetricCell label="Precision" value={`${m.precision.toFixed(1)}%`} color={model.color} />
                <MetricCell label="Recall"    value={`${m.recall.toFixed(1)}%`}    color={model.color} />
              </div>

              {/* Row 2: F1 Score · Train time + params */}
              <div className="grid grid-cols-2 gap-2">
                <MetricCell label="F1 score"              value={`${m.f1.toFixed(1)}%`}           color={model.color} />
                <MetricCell label={`Train time · ${m.parameters}`} value={m.trainTime} />
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}