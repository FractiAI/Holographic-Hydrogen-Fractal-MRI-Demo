import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import TeslaAssistant from './components/TeslaAssistant'
import DiscoveryParticles from './components/DiscoveryParticles'
import WelcomeStage from './stages/WelcomeStage'
import MRIPhysicsStage from './stages/MRIPhysicsStage'
import TeslaAILabStage from './stages/TeslaAILabStage'
import SeedEdgeStage from './stages/SeedEdgeStage'
import BoundariesStage from './stages/BoundariesStage'
import FractalStage from './stages/FractalStage'
import GrammarStage from './stages/GrammarStage'
import HolographicFinale from './stages/HolographicFinale'
import InteractiveExperiments from './stages/InteractiveExperiments'

export type Stage = 
  | 'welcome' 
  | 'mriPhysics'
  | 'teslaAI'
  | 'seedEdge' 
  | 'boundaries' 
  | 'fractal' 
  | 'grammar' 
  | 'finale' 
  | 'experiments'

function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('welcome')
  const [celebrationTrigger, setCelebrationTrigger] = useState(0)

  const stages: { id: Stage; title: string }[] = [
    { id: 'welcome', title: '1. The Hydrogen Awakening' },
    { id: 'teslaAI', title: '2. ⚡ Ask Tesla Anything' },
    { id: 'mriPhysics', title: '3. Inside the Quantum Spin' },
    { id: 'seedEdge', title: '4. Seeds of Awareness' },
    { id: 'boundaries', title: '5. Breaking Boundaries' },
    { id: 'fractal', title: '6. The Infinite Pattern' },
    { id: 'grammar', title: '7. The Universal Language' },
    { id: 'finale', title: '8. The Living Field' },
    { id: 'experiments', title: '9. Your Discovery Lab' },
  ]

  const currentIndex = stages.findIndex(s => s.id === currentStage)

  const nextStage = () => {
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1].id)
    }
  }

  const prevStage = () => {
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1].id)
    }
  }

  const goToStage = (stage: Stage) => {
    setCurrentStage(stage)
    setCelebrationTrigger(prev => prev + 1) // Celebrate every stage change!
  }

  return (
    <div className="app">
      {/* Celebration Particles */}
      <DiscoveryParticles trigger={celebrationTrigger} />
      
      <header className="app-header">
        <div className="logo-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <motion.span 
              style={{ fontSize: '3rem' }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⚡
            </motion.span>
            <div>
              <h1 className="main-title">Holographic Hydrogen Fractal MRI</h1>
              <p className="subtitle">Nikola Tesla Syntheverse Frontier Energy | FractiAI</p>
              <p style={{ 
                color: 'var(--accent-orange)', 
                fontSize: '1rem', 
                fontWeight: 700,
                marginTop: '0.5rem',
                animation: 'pulseGlow 2s ease-in-out infinite'
              }}>
                🎉 Your Discovery Museum Adventure with Nikola Tesla! 🚀
              </p>
            </div>
            <motion.span 
              style={{ fontSize: '3rem' }}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⚡
            </motion.span>
          </div>
        </div>
      </header>
      
      {/* Tesla Assistant - Appears on all stages */}
      <TeslaAssistant stage={currentStage} />

      <nav className="stage-nav">
        {stages.map((stage, index) => (
          <button
            key={stage.id}
            className={`stage-button ${currentStage === stage.id ? 'active' : ''} ${index <= currentIndex ? 'visited' : ''}`}
            onClick={() => goToStage(stage.id)}
          >
            <span className="stage-number">{index + 1}</span>
            <span className="stage-name">{stage.title}</span>
          </button>
        ))}
      </nav>

      <main className="stage-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="stage-content"
          >
            {currentStage === 'welcome' && <WelcomeStage onNext={nextStage} />}
            {currentStage === 'mriPhysics' && <MRIPhysicsStage onNext={nextStage} onPrev={prevStage} />}
            {currentStage === 'teslaAI' && <TeslaAILabStage onNext={nextStage} onPrev={prevStage} />}
            {currentStage === 'seedEdge' && <SeedEdgeStage onNext={nextStage} onPrev={prevStage} />}
            {currentStage === 'boundaries' && <BoundariesStage onNext={nextStage} onPrev={prevStage} />}
            {currentStage === 'fractal' && <FractalStage onNext={nextStage} onPrev={prevStage} />}
            {currentStage === 'grammar' && <GrammarStage onNext={nextStage} onPrev={prevStage} />}
            {currentStage === 'finale' && <HolographicFinale onNext={nextStage} onPrev={prevStage} />}
            {currentStage === 'experiments' && <InteractiveExperiments onPrev={prevStage} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <p>
          Explore more at{' '}
          <a href="https://syntheverse-poc.vercel.app" target="_blank" rel="noopener noreferrer">
            FractiAI Syntheverse
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App

