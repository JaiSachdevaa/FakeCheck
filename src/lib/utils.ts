import type { ModelId, PredictionResult } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const FAKE_SIGNALS = [
  'breaking', 'shocking', 'secret', "they don't want",
  'suppress', 'conspiracy', 'miracle', 'cure', 'share before',
  'deleted', 'mainstream media', 'microchip', 'whistleblower',
  'big pharma', 'wake up', 'hidden truth', 'exposed',
  'they are hiding', 'censored', 'banned', 'deep state',
]

const REAL_SIGNALS = [
  'according to', 'officials', 'researchers', 'study',
  'published', 'percent', 'reported', 'confirmed',
  'nasa', 'scientists say', 'data shows', 'survey',
  'university', 'journal', 'government', 'agency',
  'analysis', 'statistics', 'evidence', 'peer-reviewed',
]

const MODEL_BIAS: Record<ModelId, number> = {
  lr: 0,
  dt: 4,
  gb: -2,
  rf: -1,
}

export function analyzeText(text: string, modelId: ModelId): PredictionResult {
  const lower = text.toLowerCase()

  let fakeScore = 0
  let realScore = 0
  const detectedSignals: string[] = []

  FAKE_SIGNALS.forEach(sig => {
    if (lower.includes(sig)) {
      fakeScore += 14
      detectedSignals.push(`⚠ "${sig}"`)
    }
  })

  REAL_SIGNALS.forEach(sig => {
    if (lower.includes(sig)) {
      realScore += 11
      detectedSignals.push(`✓ "${sig}"`)
    }
  })

  // Caps ratio heuristic
  const capsRatio = (text.match(/[A-Z]/g)?.length ?? 0) / text.length
  if (capsRatio > 0.15) fakeScore += 10

  // Exclamation marks
  const exclamations = (text.match(/!/g)?.length ?? 0)
  fakeScore += Math.min(exclamations * 5, 20)

  const bias = MODEL_BIAS[modelId]
  let rawFake = Math.min(96, Math.max(4, fakeScore - realScore + 50 + bias))
  if (text.length < 50) rawFake = 50

  const isFake = rawFake > 50
  const confidence = isFake ? rawFake : 100 - rawFake

  return {
    isFake,
    confidence: Math.round(confidence),
    modelId,
    signals: detectedSignals.slice(0, 6),
    timestamp: new Date(),
  }
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
