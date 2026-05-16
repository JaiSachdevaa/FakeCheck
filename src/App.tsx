import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { DetectPage } from '@/pages/DetectPage'
import { PerformancePage } from '@/pages/PerformancePage'
import { AboutPage } from '@/pages/AboutPage'
import type { TabId } from '@/types'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('detect')

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Ambient top glow */}
      <div className="fixed inset-x-0 top-0 h-64 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/10 to-transparent" />
      </div>

      <div className="relative z-10">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="animate-fade-in">
          {activeTab === 'detect'      && <DetectPage />}
          {activeTab === 'performance' && <PerformancePage />}
          {activeTab === 'about'       && <AboutPage />}
        </main>

        <footer className="border-t border-surface-800/60 py-6 mt-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <span className="text-xs text-surface-600 font-mono">
              FakeCheck — ML Fake News Detection
            </span>
            <span className="text-xs text-surface-600 font-mono">
              LR · DT · GB · RF
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
