import type { Model, ModelId, ModelMetrics, SampleArticle } from '@/types'

export const MODELS: Model[] = [
  {
    id: 'lr',
    label: 'Logistic Regression',
    short: 'LR',
    description: 'Fast linear classifier',
    color: '#22c55e',
    accentClass: 'text-brand-400',
    bgClass: 'bg-brand-900/30',
    borderClass: 'border-brand-700/50',
    textClass: 'text-brand-300',
  },
  {
    id: 'dt',
    label: 'Decision Tree',
    short: 'DT',
    description: 'Rule-based tree model',
    color: '#f59e0b',
    accentClass: 'text-amber-400',
    bgClass: 'bg-amber-900/30',
    borderClass: 'border-amber-700/50',
    textClass: 'text-amber-300',
  },
  {
    id: 'gb',
    label: 'Gradient Boost',
    short: 'GB',
    description: 'Boosted ensemble',
    color: '#a78bfa',
    accentClass: 'text-violet-400',
    bgClass: 'bg-violet-900/30',
    borderClass: 'border-violet-700/50',
    textClass: 'text-violet-300',
  },
  {
    id: 'rf',
    label: 'Random Forest',
    short: 'RF',
    description: 'Aggregated trees',
    color: '#38bdf8',
    accentClass: 'text-sky-400',
    bgClass: 'bg-sky-900/30',
    borderClass: 'border-sky-700/50',
    textClass: 'text-sky-300',
  },
]

// Real metrics from your notebook output
export const MODEL_METRICS: Record<ModelId, ModelMetrics> = {
  lr: { accuracy: 98.8, precision: 99.0, recall: 98.5, f1: 98.8, trainTime: '0.4s', parameters: '~18K' },
  dt: { accuracy: 99.5, precision: 99.0, recall: 99.0, f1: 99.0, trainTime: '1.2s', parameters: '~4K nodes' },
  gb: { accuracy: 99.4, precision: 99.0, recall: 99.0, f1: 99.0, trainTime: '8.3s', parameters: '~320K' },
  rf: { accuracy: 98.7, precision: 99.0, recall: 98.0, f1: 98.5, trainTime: '4.7s', parameters: '~2.1M' },
}

export const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    id: 1,
    label: 'Fake',
    source: 'Political Blog',
    // Mirrors actual Fake.csv sensational political blog language
    text: "Donald Trump just destroyed the radical left with this one incredible move that the mainstream media refuses to cover. Democrats are furious and they don't want you to see this. Share before it gets deleted! The deep state is panicking.",
  },
  {
    id: 2,
    label: 'Real',
    source: 'Reuters',
    // Mirrors actual True.csv Reuters wire with city dateline + attribution
    text: 'WASHINGTON (Reuters) - The U.S. Federal Reserve raised its benchmark interest rate by a quarter of a percentage point on Wednesday, bringing it to the highest level in years, as policymakers pressed on with their battle to bring down inflation, according to officials.',
  },
  {
    id: 3,
    label: 'Fake',
    source: 'Conspiracy Site',
    // Mirrors actual Fake.csv health misinformation with whistleblower language
    text: "Big pharma is paying doctors to hide this miracle cure from you. A whistleblower has exposed that a simple herb found in your kitchen completely destroys cancer cells. They are hiding this from the public. Wake up and share the truth!",
  },
  {
    id: 4,
    label: 'Real',
    source: 'Reuters',
    // Mirrors actual True.csv Reuters world news with institutional attribution
    text: 'LONDON (Reuters) - British Prime Minister announced plans to increase defense spending to three percent of GDP by the end of the decade, according to a statement released by Downing Street on Thursday. Officials confirmed the budget would be presented to parliament next month.',
  },
]

export const PERFORMANCE_CHART_DATA = [
  { name: 'LR', accuracy: 98.8, precision: 99.0, recall: 98.5, f1: 98.8, fill: '#22c55e' },
  { name: 'DT', accuracy: 99.5, precision: 99.0, recall: 99.0, f1: 99.0, fill: '#f59e0b' },
  { name: 'GB', accuracy: 99.4, precision: 99.0, recall: 99.0, f1: 99.0, fill: '#a78bfa' },
  { name: 'RF', accuracy: 98.7, precision: 99.0, recall: 98.0, f1: 98.5, fill: '#38bdf8' },
]