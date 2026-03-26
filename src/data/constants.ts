import type { Model, ModelMetrics, ModelId, SampleArticle } from '@/types'

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

export const MODEL_METRICS: Record<ModelId, ModelMetrics> = {
  lr: { accuracy: 92.4, precision: 91.8, recall: 93.1, f1: 92.4, trainTime: '0.4s', parameters: '~18K' },
  dt: { accuracy: 88.7, precision: 87.9, recall: 89.4, f1: 88.6, trainTime: '1.2s', parameters: '~4K nodes' },
  gb: { accuracy: 95.1, precision: 94.7, recall: 95.5, f1: 95.1, trainTime: '8.3s', parameters: '~320K' },
  rf: { accuracy: 96.3, precision: 96.0, recall: 96.6, f1: 96.3, trainTime: '4.7s', parameters: '~2.1M' },
}

export const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    id: 1,
    label: 'Fake',
    source: 'Unknown Blog',
    text: 'BREAKING: Scientists confirm drinking lemon water every morning completely cures cancer. Big pharma is trying to suppress this discovery. Share before it gets deleted! This miracle cure has been hidden from the public for decades.',
  },
  {
    id: 2,
    label: 'Real',
    source: 'Reuters',
    text: 'The Federal Reserve raised its benchmark interest rate by a quarter percentage point on Wednesday, as policymakers continued their effort to lower inflation without triggering a recession, according to Federal Reserve officials who spoke after the meeting.',
  },
  {
    id: 3,
    label: 'Fake',
    source: 'Social Media',
    text: "Government is secretly installing 5G microchips inside COVID vaccines to track and control citizens. A whistleblower has revealed the shocking truth that the mainstream media refuses to cover. Wake up! They don't want you to know this.",
  },
  {
    id: 4,
    label: 'Real',
    source: 'NASA',
    text: "NASA's James Webb Space Telescope has captured the deepest and sharpest infrared image of the distant universe to date. The image shows thousands of galaxies in extraordinary detail, including the faintest objects ever observed, according to the space agency.",
  },
]

export const PERFORMANCE_CHART_DATA = [
  { name: 'LR',   accuracy: 92.4, precision: 91.8, recall: 93.1, f1: 92.4, fill: '#22c55e' },
  { name: 'DT',   accuracy: 88.7, precision: 87.9, recall: 89.4, f1: 88.6, fill: '#f59e0b' },
  { name: 'GB',   accuracy: 95.1, precision: 94.7, recall: 95.5, f1: 95.1, fill: '#a78bfa' },
  { name: 'RF',   accuracy: 96.3, precision: 96.0, recall: 96.6, f1: 96.3, fill: '#38bdf8' },
]
