export type ModelId = 'lr' | 'dt' | 'gb' | 'rf'

export interface Model {
  id: ModelId
  label: string
  short: string
  description: string
  color: string
  accentClass: string
  bgClass: string
  borderClass: string
  textClass: string
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
  trainTime: string
  parameters: string
}

export interface PredictionResult {
  isFake: boolean
  confidence: number
  modelId: ModelId
  signals: string[]
  timestamp: Date
}

export interface SampleArticle {
  id: number
  label: 'Fake' | 'Real'
  source: string
  text: string
}

export type TabId = 'detect' | 'performance' | 'about'
