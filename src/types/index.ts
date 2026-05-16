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

export interface AllModelResults {
  lr: SingleModelResult
  dt: SingleModelResult
  gb: SingleModelResult
  rf: SingleModelResult
}

export interface SingleModelResult {
  isFake: boolean
  label: 'Fake' | 'Real'
  confidence: number
  prediction: 0 | 1
}

export interface PredictionResult {
  isFake: boolean
  confidence: number
  modelId: ModelId
  signals: string[]
  timestamp: Date
  allResults?: AllModelResults   // populated when real API responds
  source: 'api' | 'mock'        // tells UI which backend answered
}

export interface SampleArticle {
  id: number
  label: 'Fake' | 'Real'
  source: string
  text: string
}

export type TabId = 'detect' | 'performance' | 'about'