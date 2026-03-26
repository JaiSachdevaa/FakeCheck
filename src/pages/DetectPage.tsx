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
    <div className="relative min-h-screen">

      {/* ── LetterGlitch covers the ENTIRE page ── */}
      <div className="fixed inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Dark overlay for readability across the whole page */}
      <div className="fixed inset-0 z-10 bg-surface-950/60" />

      {/* ── All page content sits above the bg ── */}
      <div className="relative z-20">

        {/* ── Hero ── */}
        <div className="h-[360px] sm:h-[420px] flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-2xl">

              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-brand-700/50 bg-brand-900/30 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
                <span className="text-xs font-medium text-brand-300 tracking-wide">
                  ML-powered detection
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                Detect fake news
                <br />
                <span className="gradient-text">with machine learning.</span>
              </h1>

              <p className="mt-4 text-surface-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Paste any article or headline. Our classifiers analyse linguistic
                patterns, source signals, and writing style to determine authenticity.
              </p>

              {/* Stat pills */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { value: '96.3%', label: 'Best accuracy' },
                  { value: '44.9K', label: 'Training samples' },
                  { value: '4',     label: 'Classifiers' },
                  { value: '<20ms', label: 'Avg inference' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="px-3 py-1.5 rounded-lg bg-surface-900/70 border border-surface-700/60 backdrop-blur-sm"
                  >
                    <span className="font-mono text-sm font-semibold text-surface-100">{s.value}</span>
                    <span className="text-surface-500 text-xs ml-1.5">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content below hero ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

            {/* Left — input + result */}
            <div className="space-y-5">
              <div className="glass-card p-5">
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
                <div className="glass-card p-5 animate-pulse space-y-3">
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

            {/* Right — model selector */}
            <aside>
              <div className="glass-card p-4 sticky top-20">
                <ModelSelector selected={selectedModel} onChange={setModel} />
              </div>
            </aside>
          </div>
        </div>

      </div>
    </div>
  )
}