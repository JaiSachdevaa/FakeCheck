import type { TabId } from '@/types'
import { cn } from '@/types/lib/utils'
import { ShieldCheck } from 'lucide-react'

interface NavbarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'detect',      label: 'Detect' },
  { id: 'performance', label: 'Performance' },
  { id: 'about',       label: 'About' },
]

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-md border-b border-surface-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-600/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Fake<span className="text-brand-400">Check</span>
            </span>
          </div>

          {/* Tabs */}
          <nav className="flex items-center">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150',
                  activeTab === tab.id
                    ? 'text-surface-100 bg-surface-800'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
