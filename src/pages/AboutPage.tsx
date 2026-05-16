import { MODELS, MODEL_METRICS } from '@/data/constants'

const PIPELINE_STEPS = [
  { step: '01', title: 'Data collection', desc: 'Aggregated labelled dataset of ~44.9K news articles from various sources, split 50/50 fake vs real.' },
  { step: '02', title: 'Preprocessing', desc: 'Tokenisation, stopword removal, stemming, and TF-IDF vectorisation using scikit-learn pipelines.' },
  { step: '03', title: 'Feature engineering', desc: 'N-gram features (1–3), capitalisation ratio, punctuation density, and source credibility signals.' },
  { step: '04', title: 'Training & tuning', desc: 'Grid search cross-validation (5-fold) for hyperparameter optimisation across all four classifiers.' },
  { step: '05', title: 'Evaluation', desc: 'Hold-out test split (20%). Metrics: accuracy, precision, recall, F1. Random Forest achieved 96.3%.' },
  { step: '06', title: 'Deployment', desc: 'Flask REST API wrapping the saved model (joblib) with React TypeScript frontend.' },
]

const TECH_STACK = [
  { category: 'ML / Data', items: ['Python 3', 'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'seaborn'] },
  { category: 'Frontend', items: ['React 18', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Vite'] },
  { category: 'Backend', items: ['Flask', 'joblib', 'REST API', 'CORS'] },
  { category: 'Tools', items: ['Jupyter Notebook', 'Anaconda', 'VS Code', 'Git'] },
]

export function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-surface-50">
          About the project
        </h1>
        <p className="mt-2 text-surface-400 text-sm leading-relaxed">
          FakeCheck is a machine learning project that automatically classifies news
          articles as genuine or fabricated using four different classification algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dataset */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-surface-200">Dataset</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total samples', value: '44,898' },
              { label: 'Real articles',  value: '21,417' },
              { label: 'Fake articles',  value: '23,481' },
              { label: 'Test split',     value: '20%' },
            ].map(stat => (
              <div key={stat.label} className="bg-surface-800/50 rounded-xl p-3">
                <div className="font-mono text-lg font-semibold text-surface-100">{stat.value}</div>
                <div className="text-[11px] text-surface-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-surface-400 leading-relaxed">
            Labelled dataset of news articles (True / Fake), sourced from public repositories
            and fact-checking platforms. Balanced across categories after cleaning.
          </p>
        </div>

        {/* Classifiers summary */}
        <div className="glass-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-surface-200">Classifiers</h2>
          {MODELS.map(model => {
            const m = MODEL_METRICS[model.id]
            return (
              <div key={model.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: model.color + '18', color: model.color, border: `1px solid ${model.color}30` }}
                >
                  {model.short}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-200">{model.label}</span>
                    <span className="font-mono text-xs text-surface-400">{m.accuracy}% acc</span>
                  </div>
                  <p className="text-[11px] text-surface-500 truncate">{model.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pipeline */}
      <div className="glass-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-surface-200 mb-5">ML pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIPELINE_STEPS.map(step => (
            <div key={step.step} className="bg-surface-800/40 rounded-xl p-4 border border-surface-700/40">
              <div className="font-mono text-[10px] text-brand-500 mb-2 tracking-widest">STEP {step.step}</div>
              <h3 className="text-sm font-semibold text-surface-100 mb-1.5">{step.title}</h3>
              <p className="text-[12px] text-surface-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-surface-200 mb-4">Tech stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TECH_STACK.map(group => (
            <div key={group.category}>
              <p className="text-[11px] font-medium text-surface-500 uppercase tracking-widest mb-2">
                {group.category}
              </p>
              <ul className="space-y-1.5">
                {group.items.map(item => (
                  <li
                    key={item}
                    className="text-xs font-mono text-surface-300 bg-surface-800/50 rounded-lg px-2.5 py-1.5 border border-surface-700/40"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* System requirements */}
      <div className="mt-6 glass-card p-5">
        <h2 className="text-sm font-semibold text-surface-200 mb-3">System requirements</h2>
        <div className="grid grid-cols-2 gap-4 text-xs text-surface-400">
          <div>
            <p className="text-[11px] text-surface-500 uppercase tracking-widest mb-2">Hardware</p>
            <ul className="space-y-1 font-mono">
              <li>4 GB RAM (minimum)</li>
              <li>Intel i3 or equivalent</li>
              <li>500 MB free disk space</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] text-surface-500 uppercase tracking-widest mb-2">Software</p>
            <ul className="space-y-1 font-mono">
              <li>Python 3.8+</li>
              <li>Node.js 18+</li>
              <li>Anaconda (optional)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
