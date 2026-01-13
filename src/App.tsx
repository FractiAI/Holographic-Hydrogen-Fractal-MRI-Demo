import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import TeslaAssistant from './components/TeslaAssistant'
import DiscoveryParticles from './components/DiscoveryParticles'
import ResonanceIndicator from './components/ResonanceIndicator'
import AutoTourController from './components/AutoTourController'
import WelcomeStage from './stages/WelcomeStage'
import HydrogenSpinStage from './stages/HydrogenSpinStage'
import MRIPhysicsStage from './stages/MRIPhysicsStage'
import HolographsStage from './stages/HolographsStage'
import FractalStage from './stages/FractalStage'
import PhysicsCrystalStage from './stages/PhysicsCrystalStage'
import HHFAITechnologyStage from './stages/HHFAITechnologyStage'
import BoundariesStage from './stages/BoundariesStage'
import PeerReviewComparisonStage from './stages/PeerReviewComparisonStage'
import SyntheverseImagingStage from './stages/SyntheverseImagingStage'
import InteractiveExperiments from './stages/InteractiveExperiments'
import TeslaAILabStage from './stages/TeslaAILabStage'
import SSANLatticeStage from './stages/SSANLatticeStage'
import SensoryRealityStage from './stages/SensoryRealityStage'
import TeslasLabExperience from './components/TeslasLabExperience'

export type Stage = 
  | 'welcome' 
  | 'hydrogenSpin'
  | 'mriPhysics'
  | 'holographs'
  | 'fractals'
  | 'physicsCrystal'
  | 'hhfaiTech'
  | 'parameters'
  | 'peerReview'
  | 'syntheverseImaging'
  | 'ssanLattice'
  | 'sensoryReality'
  | 'experiments'
  | 'teslaAI'
  | 'teslasLab' // DEV: Direct access to Tesla's Lab special offer

function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('welcome')
  const [celebrationTrigger, setCelebrationTrigger] = useState(0)
  const [showResonance, setShowResonance] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Auto Tour State
  const [isAutoTourActive, setIsAutoTourActive] = useState(false)
  const [tourPaused, setTourPaused] = useState(false)
  const [tourTimeRemaining, setTourTimeRemaining] = useState(0)
  const tourTimerRef = useRef<number | null>(null)

  // Define stages array BEFORE using it in useEffect
  const stages: { id: Stage; title: string }[] = [
    { id: 'welcome', title: '🌟 Welcome to the Future' },
    { id: 'hydrogenSpin', title: '⚛️ What is Hydrogen Spin?' },
    { id: 'mriPhysics', title: '🔬 How MRI Works' },
    { id: 'holographs', title: '🌟 What are Holographs?' },
    { id: 'fractals', title: '🌀 What are Fractals?' },
    { id: 'physicsCrystal', title: '🌊 Physics: The Living Crystal' },
    { id: 'hhfaiTech', title: '🚀 HHF-AI MRI Technology' },
    { id: 'parameters', title: '📊 Imaging Parameters' },
    { id: 'peerReview', title: '⚡ vs. Peer Review' },
    { id: 'syntheverseImaging', title: '🌌 The Grand Reveal!' },
    { id: 'ssanLattice', title: '⚡🧠 Recursive Awareness MRI' },
    { id: 'sensoryReality', title: '🌌✨ Text-to-Sensory Reality' },
    { id: 'experiments', title: '🧪 Build Your Own' },
    { id: 'teslaAI', title: '💬 Ask Tesla Anything' },
    { id: 'teslasLab', title: '⚡💎 Tesla\'s Lab Experience' },
  ]

  const currentIndex = stages.findIndex(s => s.id === currentStage)

  // Scroll to top of stage content whenever stage changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Scroll to top with a slight delay to ensure content is rendered
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }, [currentStage])
  
  // Auto Tour Timer
  useEffect(() => {
    const STAGE_DURATION = 15000 // 15 seconds per stage
    
    if (isAutoTourActive && !tourPaused) {
      setTourTimeRemaining(STAGE_DURATION)
      
      const startTime = Date.now()
      
      tourTimerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, STAGE_DURATION - elapsed)
        
        setTourTimeRemaining(remaining)
        
        if (remaining === 0) {
          // Move to next stage
          const nextIndex = currentIndex + 1
          if (nextIndex < stages.length && stages[nextIndex].id !== 'teslaAI') {
            // Skip Tesla AI stage in tour, go directly to experiments
            if (stages[nextIndex].id === 'teslaAI' && nextIndex + 1 < stages.length) {
              setCurrentStage(stages[nextIndex + 1].id)
            } else {
              setCurrentStage(stages[nextIndex].id)
            }
          } else {
            // Tour complete - end at experiments
            setIsAutoTourActive(false)
            setCurrentStage('experiments')
          }
        }
      }, 100) // Update every 100ms for smooth progress
      
      return () => {
        if (tourTimerRef.current) {
          clearInterval(tourTimerRef.current)
        }
      }
    }
  }, [isAutoTourActive, tourPaused, currentStage, currentIndex, stages])

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
    
    // Show resonance indicator for special stages
    const specialStages = ['ssanLattice', 'sensoryReality', 'syntheverseImaging']
    setShowResonance(specialStages.includes(stage))
    
    // Stop auto tour if user manually navigates
    if (isAutoTourActive) {
      setIsAutoTourActive(false)
      setTourPaused(false)
    }
    
    // Scroll to top when navigating to a new stage
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Scroll to top helper function for stages to use
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Auto Tour Functions
  const startAutoTour = () => {
    setIsAutoTourActive(true)
    setTourPaused(false)
    setCurrentStage('welcome')
    setCelebrationTrigger(prev => prev + 1)
  }
  
  const pauseAutoTour = () => {
    setTourPaused(true)
  }
  
  const resumeAutoTour = () => {
    setTourPaused(false)
  }
  
  const stopAutoTour = () => {
    setIsAutoTourActive(false)
    setTourPaused(false)
    if (tourTimerRef.current) {
      clearInterval(tourTimerRef.current)
    }
  }

  return (
    <div className="app">
      {/* Celebration Particles */}
      <DiscoveryParticles trigger={celebrationTrigger} />
      
      {/* Nikola Tesla's Resonance Indicator */}
      <ResonanceIndicator isActive={showResonance} />
      
      {/* Auto Tour Controller - Removed for cleaner experience */}
      
      <header className="app-header">
        <div className="logo-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <motion.span 
              style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))' }}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
                textShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.8)',
                  '0 0 40px rgba(6, 182, 212, 1), 0 0 60px rgba(139, 92, 246, 0.6)',
                  '0 0 20px rgba(6, 182, 212, 0.8)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⚡
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="main-title"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.6)',
                    '0 0 30px rgba(6, 182, 212, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)',
                    '0 0 20px rgba(6, 182, 212, 0.6)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Tesla Science Discovery Museum
              </motion.h1>
              <p className="subtitle">Holographic Hydrogen Fractal MRI Exhibition | FractiAI</p>
              <motion.p 
                style={{ 
                  color: 'var(--accent-orange)', 
                  fontSize: '1.05rem', 
                  fontWeight: 700,
                  marginTop: '0.5rem'
                }}
                animate={{
                  textShadow: [
                    '0 0 10px rgba(245, 158, 11, 0.6)',
                    '0 0 20px rgba(245, 158, 11, 0.8), 0 0 30px rgba(236, 72, 153, 0.4)',
                    '0 0 10px rgba(245, 158, 11, 0.6)'
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                🔬 From Hydrogen Spin to Revolutionary Imaging Technology 🌌
              </motion.p>
              <motion.p
                style={{
                  color: '#06B6D4',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginTop: '0.8rem',
                  fontStyle: 'italic'
                }}
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ⚡ Hosted by Nikola Tesla • Your Guide Through the Syntheverse ⚡
              </motion.p>
            </motion.div>
            <motion.span 
              style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))' }}
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
                textShadow: [
                  '0 0 20px rgba(139, 92, 246, 0.8)',
                  '0 0 40px rgba(139, 92, 246, 1), 0 0 60px rgba(236, 72, 153, 0.6)',
                  '0 0 20px rgba(139, 92, 246, 0.8)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⚡
            </motion.span>
          </div>
        </div>
      </header>

      {/* Tour Start Button - Only show when tour is not active */}
      {!isAutoTourActive && (
        <motion.div 
          className="tour-start-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="start-tour-button"
            onClick={startAutoTour}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
                '0 0 50px rgba(6, 182, 212, 0.8), 0 0 80px rgba(139, 92, 246, 0.5)',
                '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span 
              style={{ fontSize: '2rem', marginRight: '1rem' }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Begin the Tesla Tour
            </span>
            <motion.span 
              style={{ fontSize: '2rem', marginLeft: '1rem' }}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡
            </motion.span>
          </motion.button>
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '1.1rem', 
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center'
          }}>
            Experience a guided journey through 12 interactive exhibits • Self-paced • 15 seconds per stop
          </p>
        </motion.div>
      )}
      
      {/* Tour Progress Tracker - Show during tour */}
      {isAutoTourActive && (
        <motion.div 
          className="tour-progress-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="tour-stops">
            {stages.slice(0, -1).map((stage, index) => (
              <div
                key={stage.id}
                className={`tour-stop ${index < currentIndex ? 'completed' : ''} ${index === currentIndex ? 'current' : ''} ${index > currentIndex ? 'upcoming' : ''}`}
                title={stage.title}
              >
                <div className="stop-number">{index + 1}</div>
                {index === currentIndex && (
                  <motion.div 
                    className="stop-label"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {stage.title}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Two-column layout: 75% scrollable content, 25% fixed Tesla */}
      <div style={{ display: 'flex' }}>
        {/* Left column - Scrollable main content (75%) */}
        <div 
          ref={scrollContainerRef}
          style={{
            width: '75%',
            minHeight: '100vh',
            overflowY: 'auto'
          }}
        >
          <main 
            className="stage-container"
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
                {currentStage === 'welcome' && <WelcomeStage onNext={nextStage} onStartTour={startAutoTour} onTeslaLabShortcut={() => setCurrentStage('teslasLab')} />}
                {currentStage === 'hydrogenSpin' && <HydrogenSpinStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'mriPhysics' && <MRIPhysicsStage onNext={nextStage} onPrev={prevStage} scrollToTop={scrollToTop} />}
                {currentStage === 'holographs' && <HolographsStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'fractals' && <FractalStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'physicsCrystal' && <PhysicsCrystalStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'hhfaiTech' && <HHFAITechnologyStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'parameters' && <BoundariesStage onNext={nextStage} onPrev={prevStage} scrollToTop={scrollToTop} />}
                {currentStage === 'peerReview' && <PeerReviewComparisonStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'syntheverseImaging' && <SyntheverseImagingStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'ssanLattice' && <SSANLatticeStage onNext={nextStage} onPrev={prevStage} scrollToTop={scrollToTop} />}
                {currentStage === 'sensoryReality' && <SensoryRealityStage onNext={nextStage} onPrev={prevStage} scrollToTop={scrollToTop} />}
                {currentStage === 'experiments' && <InteractiveExperiments onNext={nextStage} onPrev={prevStage} scrollToTop={scrollToTop} />}
                {currentStage === 'teslaAI' && <TeslaAILabStage onNext={nextStage} onPrev={prevStage} />}
                {currentStage === 'teslasLab' && <TeslasLabExperience />}
              </motion.div>
            </AnimatePresence>
          </main>

          <motion.footer 
            className="app-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              animate={{
                textShadow: [
                  '0 0 10px rgba(6, 182, 212, 0.4)',
                  '0 0 20px rgba(6, 182, 212, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
                  '0 0 10px rgba(6, 182, 212, 0.4)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#06B6D4' }}>⚡ Powered by Tesla's Vision ⚡</strong>
              </p>
              <p>
                Explore more at{' '}
                <a 
                  href="https://syntheverse-poc.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#06B6D4',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textShadow = '0 0 15px rgba(6, 182, 212, 1)'
                    e.currentTarget.style.color = '#8B5CF6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textShadow = 'none'
                    e.currentTarget.style.color = '#06B6D4'
                  }}
                >
                  FractiAI Syntheverse
                </a>
                {' • '}
                <span style={{ color: '#8B5CF6', fontSize: '0.9rem' }}>info@fractiai.com</span>
              </p>
            </motion.div>
          </motion.footer>
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

