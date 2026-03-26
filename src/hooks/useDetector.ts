import { useState, useCallback } from 'react'
import type { ModelId, PredictionResult } from '@/types'
import { analyzeText } from '@/lib/utils'

interface DetectorState {
  text: string
  selectedModel: ModelId
  result: PredictionResult | null
  isLoading: boolean
  history: PredictionResult[]
}

export function useDetector() {
  const [state, setState] = useState<DetectorState>({
    text: '',
    selectedModel: 'rf',
    result: null,
    isLoading: false,
    history: [],
  })

  const setText = useCallback((text: string) => {
    setState(prev => ({ ...prev, text, result: null }))
  }, [])

  const setModel = useCallback((selectedModel: ModelId) => {
    setState(prev => ({ ...prev, selectedModel, result: null }))
  }, [])

  const analyze = useCallback(async () => {
    if (!state.text.trim()) return

    setState(prev => ({ ...prev, isLoading: true, result: null }))

    // Simulate async API call
    await new Promise(res => setTimeout(res, 1100 + Math.random() * 400))

    const result = analyzeText(state.text, state.selectedModel)

    setState(prev => ({
      ...prev,
      isLoading: false,
      result,
      history: [result, ...prev.history].slice(0, 10),
    }))
  }, [state.text, state.selectedModel])

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, text: '', result: null }))
  }, [])

  return { ...state, setText, setModel, analyze, reset }
}
