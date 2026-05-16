import { ArticleInput } from '@/components/features/ArticleInput'
import { ModelSelector } from '@/components/features/ModelSelector'
import { ResultCard } from '@/components/features/ResultCard'
import LetterGlitch from '@/components/LetterGlitch'
import { useDetector } from '@/hooks/useDetector'
import { useEffect, useRef } from 'react'

export function DetectPage() {
  const { text, selectedModel, result, isLoading, setText, setModel, analyze, reset } = useDetector()
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [result])

  return (
    <div>
      {/*Hero*/}
      <div className="relative h-[320px] sm:h-[380px] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
        </div>
        <div className="absolute inset-0 z-10 bg-surface-950/65" />

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              Detect fake news
              <br />
              <span className="gradient-text">with machine learning.</span>
            </h1>
            <p className="mt-4 text-surface-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Paste any article or headline. Our classifiers analyse linguistic
              patterns, source signals, and writing style to determine authenticity.
            </p>
          </div>
        </div>
      </div>

      {/*Main content*/}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

          {/* Left input + result */}
          <div className="space-y-5">
            {/* Input card solid bg for contrast against glitch */}
            <div className="rounded-2xl border border-surface-700 bg-surface-900 p-5 shadow-lg">
              <ArticleInput
                text={text}
                selectedModel={selectedModel}
                isLoading={isLoading}
                onChange={setText}
                onAnalyze={analyze}
                onReset={reset}
              />
            </div>

            {isLoading && (
              <div className="rounded-2xl border border-surface-700 bg-surface-900 p-5 animate-pulse space-y-3 shadow-lg">
                <div className="h-4 bg-surface-800 rounded w-1/3" />
                <div className="h-4 bg-surface-800 rounded w-2/3" />
                <div className="h-4 bg-surface-800 rounded w-1/2" />
              </div>
            )}

            {result && !isLoading && (
              <div ref={resultRef}>
                <ResultCard result={result} />
              </div>
            )}
          </div>

          {/* Right model selector */}
          <aside>
            {/* Solid bg for contrast */}
            <div className="rounded-2xl border border-surface-700 bg-surface-900 p-4 sticky top-20 shadow-lg">
              <ModelSelector selected={selectedModel} onChange={setModel} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}