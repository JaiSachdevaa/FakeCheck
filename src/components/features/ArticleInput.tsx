import { Button } from '@/components/ui/Button'
import type { ModelId } from '@/types'
import { cn } from '@/types/lib/utils'
import { X } from 'lucide-react'
import { useRef } from 'react'
import { SamplePicker } from './SamplePicker'

interface ArticleInputProps {
  text: string
  selectedModel: ModelId
  isLoading: boolean
  onChange: (text: string) => void
  onAnalyze: () => void
  onReset: () => void
}

export function ArticleInput({
  text,
  isLoading,
  onChange,
  onAnalyze,
  onReset,
}: ArticleInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="space-y-4">
      <SamplePicker onSelect={(t) => { onChange(t); textareaRef.current?.focus() }} />

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste a news headline, article excerpt, or social media post here…"
          rows={7}
          className={cn(
            'w-full resize-none rounded-xl px-4 py-3.5 text-sm leading-relaxed',
            'bg-surface-900 border border-surface-700',
            'text-surface-100 placeholder:text-surface-600',
            'focus:outline-none focus:ring-2 focus:ring-brand-600/50 focus:border-brand-700',
            'transition-all duration-150',
            'font-sans'
          )}
        />
        {text.length > 0 && (
          <button
            onClick={() => { onChange(''); onReset() }}
            className="absolute top-3 right-3 p-1 rounded-md text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-surface-600">
            {text.length.toLocaleString()} chars
          </span>
          {text.length > 0 && (
            <span className="text-xs font-mono text-surface-600">
              ~{Math.ceil(text.split(/\s+/).filter(Boolean).length)} words
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!text.trim() || isLoading}
          onClick={onAnalyze}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          }
        >
          {isLoading ? 'Analyzing…' : 'Analyze'}
        </Button>
      </div>
    </div>
  )
}
