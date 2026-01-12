import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import TeslaAssistant from './components/TeslaAssistant'
import DiscoveryParticles from './components/DiscoveryParticles'
import WelcomeStage from './stages/WelcomeStage'
import HydrogenSpinStage from './stages/HydrogenSpinStage'
import MRIPhysicsStage from './stages/MRIPhysicsStage'
import HolographsStage from './stages/HolographsStage'
import FractalStage from './stages/FractalStage'
import HHFAITechnologyStage from './stages/HHFAITechnologyStage'
import BoundariesStage from './stages/BoundariesStage'
import PeerReviewComparisonStage from './stages/PeerReviewComparisonStage'
import SyntheverseImagingStage from './stages/SyntheverseImagingStage'
import InteractiveExperiments from './stages/InteractiveExperiments'
import TeslaAILabStage from './stages/TeslaAILabStage'

export type Stage = 
  | 'welcome' 
  | 'hydrogenSpin'
  | 'mriPhysics'
  | 'holographs'
  | 'fractals'
  | 'hhfaiTech'
  | 'parameters'
  | 'peerReview'
  | 'syntheverseImaging'
  | 'experiments'
  | 'teslaAI'

function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('welcome')
  const [celebrationTrigger, setCelebrationTrigger] = useState(0)
  const stageContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to beginning of stage content whenever stage changes
  useEffect(() => {
    if (stageContainerRef.current) {
      stageContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentStage])

  const stages: { id: Stage; title: string }[] = [
    { id: 'welcome', title: '🌟 Welcome to the Future' },
    { id: 'hydrogenSpin', title: '⚛️ What is Hydrogen Spin?' },
    { id: 'mriPhysics', title: '🔬 How MRI Works' },
    { id: 'holographs', title: '🌟 What are Holographs?' },
    { id: 'fractals', title: '🌀 What are Fractals?' },
    { id: 'hhfaiTech', title: '🚀 HHF-AI MRI Technology' },
    { id: 'parameters', title: '📊 Imaging Parameters' },
    { id: 'peerReview', title: '⚡ vs. Peer Review' },
    { id: 'syntheverseImaging', title: '🌌 The Grand Reveal!' },
    { id: 'experiments', title: '🧪 Build Your Own' },
    { id: 'teslaAI', title: '💬 Ask Tesla Anything' },
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
              <h1 className="main-title">Tesla Science Discovery Museum</h1>
              <p className="subtitle">Holographic Hydrogen Fractal MRI Exhibition | FractiAI</p>
              <p style={{ 
                color: 'var(--accent-orange)', 
                fontSize: '1.05rem', 
                fontWeight: 700,
                marginTop: '0.5rem',
                animation: 'pulseGlow 2s ease-in-out infinite'
              }}>
                🔬 From Hydrogen Spin to Revolutionary Imaging Technology 🌌
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

      {/* Two-column layout: 75% scrollable content, 25% fixed Tesla */}
      <div style={{ display: 'flex' }}>
        {/* Left column - Scrollable main content (75%) */}
        <div style={{
          width: '75%',
          minHeight: '100vh',
          overflowY: 'auto'
        }}>
          <main 
            className="stage-container" 
            ref={stageContainerRef}
          >
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
                {currentStage === 'hydrogenSpin' && <HydrogenSpinStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'mriPhysics' && <MRIPhysicsStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'holographs' && <HolographsStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'fractals' && <FractalStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'hhfaiTech' && <HHFAITechnologyStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'parameters' && <BoundariesStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'peerReview' && <PeerReviewComparisonStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'syntheverseImaging' && <SyntheverseImagingStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'experiments' && <InteractiveExperiments onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'teslaAI' && <TeslaAILabStage onNext={nextStage} onPrev={prevStage} />}
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

        {/* Right column - Fixed Tesla Assistant (25%) */}
        <aside style={{
          width: '25%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'hidden'
        }}>
          <TeslaAssistant stage={currentStage} />
        </aside>
      </div>
    </div>
  )
}

export default App

