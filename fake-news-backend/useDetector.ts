import { useState, useCallback } from 'react'
import type { ModelId, PredictionResult } from '@/types'
import { analyzeText } from '@/lib/utils'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

interface DetectorState {
  text: string
  selectedModel: ModelId
  result: PredictionResult | null
  isLoading: boolean
  error: string | null
  history: PredictionResult[]
  usingMockApi: boolean
}

interface ApiResponse {
  isFake: boolean
  confidence: number
  model: string
  label: string
  all: Record<string, { isFake: boolean; confidence: number; label: string }>
}

export function useDetector() {
  const [state, setState] = useState<DetectorState>({
    text: '',
    selectedModel: 'rf',
    result: null,
    isLoading: false,
    error: null,
    history: [],
    usingMockApi: false,
  })

  const setText = useCallback((text: string) => {
    setState(prev => ({ ...prev, text, result: null, error: null }))
  }, [])

  const setModel = useCallback((selectedModel: ModelId) => {
    setState(prev => ({ ...prev, selectedModel, result: null, error: null }))
  }, [])

  const analyze = useCallback(async () => {
    if (!state.text.trim()) return

    setState(prev => ({ ...prev, isLoading: true, result: null, error: null }))

    let result: PredictionResult
    let usingMockApi = false

    try {
      // ── Try real Flask API first ─────────────────────────────────────────
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: state.text, model: state.selectedModel }),
        signal: AbortSignal.timeout(8000), // 8s timeout
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error ?? `Server error ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      result = {
        isFake:     data.isFake,
        confidence: Math.round(data.confidence),
        modelId:    state.selectedModel,
        signals:    [],
        timestamp:  new Date(),
      }

    } catch (apiErr) {
      // ── Fall back to local mock if API is offline ────────────────────────
      console.warn('Flask API unreachable, using mock analyser:', apiErr)
      usingMockApi = true

      await new Promise(res => setTimeout(res, 900))
      result = analyzeText(state.text, state.selectedModel)
    }

    setState(prev => ({
      ...prev,
      isLoading: false,
      result,
      usingMockApi,
      history: [result, ...prev.history].slice(0, 10),
    }))
  }, [state.text, state.selectedModel])

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, text: '', result: null, error: null }))
  }, [])

  return { ...state, setText, setModel, analyze, reset }
}
