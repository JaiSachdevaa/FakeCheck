import type { AllModelResults, ModelId, PredictionResult } from '@/types'
import { analyzeText } from '@/types/lib/utils'
import { useCallback, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

interface DetectorState {
  text: string
  selectedModel: ModelId
  result: PredictionResult | null
  isLoading: boolean
  error: string | null
  history: PredictionResult[]
}

interface ApiResponse {
  model: string
  isFake: boolean
  label: 'Fake' | 'Real'
  confidence: number
  all: AllModelResults
}

export function useDetector() {
  const [state, setState] = useState<DetectorState>({
    text: '',
    selectedModel: 'rf',
    result: null,
    isLoading: false,
    error: null,
    history: [],
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

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: state.text, model: state.selectedModel }),
        signal: AbortSignal.timeout(8000),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { error?: string }
        throw new Error(err.error ?? `Server error ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      result = {
        isFake:     data.isFake,
        confidence: Math.round(data.confidence),
        modelId:    state.selectedModel,
        signals:    [],
        timestamp:  new Date(),
        allResults: data.all,
        source:     'api',
      }

      // ── Save to localStorage so PerformancePage can read it
      localStorage.setItem('fakecheck_last_result', JSON.stringify(result))

    } catch (apiErr) {
      console.warn('Flask API unreachable, using local mock:', apiErr)
      await new Promise(res => setTimeout(res, 900))

      result = {
        ...analyzeText(state.text, state.selectedModel),
        source: 'mock',
      }

      // ── Save to localStorage so PerformancePage can read it ──
      localStorage.setItem('fakecheck_last_result', JSON.stringify(result))
    }

    setState(prev => ({
      ...prev,
      isLoading: false,
      result,
      error: null,
      history: [result, ...prev.history].slice(0, 10),
    }))
  }, [state.text, state.selectedModel])

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, text: '', result: null, error: null }))
  }, [])

  return { ...state, setText, setModel, analyze, reset }
}