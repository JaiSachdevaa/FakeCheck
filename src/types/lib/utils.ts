import type { ModelId, PredictionResult } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Whole-word matcher — prevents 'cure' matching inside 'captured' ────────────
function matchesWholeWord(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i').test(text)
}

// ── Weighted signal tables ────────────────────────────────────────────────────
// Each entry: [phrase, weight]
const FAKE_SIGNALS: [string, number][] = [
  // Very strong fake indicators
  ["share before it gets deleted", 40],
  ["they don't want you to know", 40],
  ["mainstream media won't tell you", 35],
  ["wake up sheeple", 35],
  ["big pharma", 30],
  ["deep state", 30],
  ["hidden truth", 28],
  ["they are hiding", 28],
  ["censored", 25],
  ["whistleblower reveals", 25],
  ["shocking truth", 25],
  ["miracle cure", 25],
  // Moderate fake indicators
  ["breaking", 12],
  ["shocking", 12],
  ["conspiracy", 18],
  ["suppressed", 18],
  ["whistleblower", 15],
  ["microchip", 20],
  ["wake up", 15],
  ["exposed", 12],
  ["banned", 10],
  ["they don't want", 20],
  ["share before", 22],
  ["gets deleted", 22],
]

const REAL_SIGNALS: [string, number][] = [
  // Very strong real indicators
  ["reuters", 35],
  ["associated press", 35],
  ["according to officials", 32],
  ["peer-reviewed", 30],
  ["published in", 28],
  ["the study found", 28],
  ["researchers at", 28],
  ["scientists say", 25],
  ["data shows", 25],
  ["in a statement", 22],
  ["told reporters", 22],
  ["said in an email", 22],
  // Moderate real indicators
  ["according to", 18],
  ["officials", 14],
  ["researchers", 14],
  ["university", 16],
  ["government", 12],
  ["agency", 10],
  ["reported", 12],
  ["confirmed", 12],
  ["analysis", 12],
  ["statistics", 12],
  ["evidence", 12],
  ["journal", 15],
  ["percent", 10],
  ["survey", 12],
  ["nasa", 20],
  ["study", 12],
]

const MODEL_BIAS: Record<ModelId, number> = {
  lr: 0,
  dt: 3,
  gb: -3,
  rf: -2,
}

export function analyzeText(text: string, modelId: ModelId): PredictionResult {
  const lower = text.toLowerCase()

  let fakeScore = 0
  let realScore = 0
  const detectedSignals: string[] = []

  // Score fake signals (whole-word match)
  for (const [phrase, weight] of FAKE_SIGNALS) {
    if (matchesWholeWord(lower, phrase)) {
      fakeScore += weight
      detectedSignals.push(`⚠ "${phrase}"`)
    }
  }

  // Score real signals (whole-word match)
  for (const [phrase, weight] of REAL_SIGNALS) {
    if (matchesWholeWord(lower, phrase)) {
      realScore += weight
      detectedSignals.push(`✓ "${phrase}"`)
    }
  }

  // Heuristics
  const words = text.trim().split(/\s+/)
  const allCapsWords = words.filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w))
  fakeScore += Math.min(allCapsWords.length * 8, 24)  // ALL CAPS words (not acronyms)

  const exclamations = (text.match(/!/g)?.length ?? 0)
  fakeScore += Math.min(exclamations * 8, 24)

  const questionBangs = (text.match(/\?!/g)?.length ?? 0)
  fakeScore += Math.min(questionBangs * 10, 20)

  // Normalize: rawFake of 50 = no signal either way
  const bias = MODEL_BIAS[modelId]
  const netScore = fakeScore - realScore
  let rawFake = Math.min(96, Math.max(4, netScore + 50 + bias))

  // Not enough text to judge
  if (text.trim().length < 60) rawFake = 50

  const isFake = rawFake > 50
  const confidence = isFake ? rawFake : 100 - rawFake

  return {
    isFake,
    confidence: Math.round(Math.min(confidence, 96)),
    modelId,
    signals: detectedSignals.slice(0, 6),
    timestamp: new Date(),
    source: 'mock',
  }
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}