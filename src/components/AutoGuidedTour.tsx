/**
 * Auto Guided Tour - Museum-style self-guided tour with automated cursor and narration
 * User just follows along, system handles navigation and highlights
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GuidedTourCursor from './GuidedTourCursor'
import './AutoGuidedTour.css'

interface TourStep {
  stage: string
  title: string
  narration: string
  cursorTargets: Array<{
    selector?: string
    x?: number
    y?: number
    label: string
    action: 'click' | 'hover' | 'look'
    duration: number
  }>
  duration: number // Total time on this stage
  requiresInteraction?: boolean
}

interface AutoGuidedTourProps {
  isActive: boolean
  onStageChange: (stage: string) => void
  onComplete: () => void
  onPause: () => void
}

export default function AutoGuidedTour({
  isActive,
  onStageChange,
  onComplete,
  onPause
}: AutoGuidedTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0)
  const [narrationVisible, setNarrationVisible] = useState(false)
  const [cursorTargets, setCursorTargets] = useState<any[]>([])

  const tourSteps: TourStep[] = [
    {
      stage: 'welcome',
      title: 'Welcome to Protocol I',
      narration: "Welcome! I'm Nikola Tesla, and I'll guide you through this holographic protocol. Just sit back and follow the cursor - I'll show you everything.",
      cursorTargets: [
        { x: window.innerWidth / 2, y: 200, label: 'This is Protocol I - A holographic seed', action: 'look', duration: 3000 },
        { x: window.innerWidth / 2, y: 400, label: 'Notice: This unpacks at YOUR edge', action: 'look', duration: 3000 }
      ],
      duration: 10000
    },
    {
      stage: 'hydrogenSpin',
      title: 'Hydrogen Spin - The Foundation',
      narration: "Observe: 7 × 10²⁷ hydrogen atoms in your body, each spinning like a microscopic gyroscope. This is the carrier frequency of awareness itself.",
      cursorTargets: [
        { x: window.innerWidth / 2, y: 300, label: 'Watch the hydrogen atom spin', action: 'look', duration: 4000 },
        { x: 200, y: 500, label: 'Try adjusting the magnetic field', action: 'hover', duration: 3000 },
        { x: window.innerWidth / 2, y: 600, label: 'See how frequency changes with B₀', action: 'look', duration: 3000 }
      ],
      duration: 15000,
      requiresInteraction: false
    },
    {
      stage: 'mriPhysics',
      title: 'MRI Physics - The Bloch Equations',
      narration: "The Bloch equations govern quantum spin dynamics. In my time, we were just discovering quantum mechanics. Now you can manipulate these equations in real-time.",
      cursorTargets: [
        { x: 300, y: 300, label: 'These are the actual Bloch equations', action: 'look', duration: 4000 },
        { x: 200, y: 500, label: 'Adjust T1 relaxation time', action: 'hover', duration: 3000 },
        { x: 200, y: 600, label: 'Adjust T2 relaxation time', action: 'hover', duration: 3000 }
      ],
      duration: 15000
    },
    {
      stage: 'ssanLattice',
      title: 'SSAN Lattice - The Network Topology',
      narration: "This is a Self-Similar Awareness Network. 600 nodes arranged in small-world topology. Your navigation through this demo forms a similar pattern.",
      cursorTargets: [
        { x: window.innerWidth / 2, y: 300, label: 'Rotate the 3D lattice structure', action: 'hover', duration: 5000 },
        { x: 400, y: 400, label: 'Click on different nodes', action: 'click', duration: 4000 },
        { x: window.innerWidth / 2, y: 600, label: 'Notice the self-similar patterns', action: 'look', duration: 4000 }
      ],
      duration: 20000,
      requiresInteraction: true
    },
    {
      stage: 'sensoryReality',
      title: 'Text-to-Reality Engine',
      narration: "At 1.420 GHz - the hydrogen hyperfine frequency - linguistic information transforms into full sensory reality. Type any scenario and watch it materialize.",
      cursorTargets: [
        { x: window.innerWidth / 2, y: 300, label: 'The text-to-reality interface', action: 'look', duration: 4000 },
        { x: 300, y: 500, label: 'Try typing a scenario here', action: 'click', duration: 5000 }
      ],
      duration: 15000,
      requiresInteraction: true
    }
  ]

  const currentStep = tourSteps[currentStepIndex]

  // Show narration when entering new stage
  useEffect(() => {
    if (!isActive || !currentStep) return

    setNarrationVisible(true)
    onStageChange(currentStep.stage)
    
    // Hide narration after 5 seconds
    const timer = setTimeout(() => {
      setNarrationVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentStepIndex, isActive, currentStep, onStageChange])

  // Calculate cursor positions from selectors
  useEffect(() => {
    if (!currentStep) return

    const targets = currentStep.cursorTargets.map(target => {
      if (target.x !== undefined && target.y !== undefined) {
        return target
      }
      
      if (target.selector) {
        const element = document.querySelector(target.selector)
        if (element) {
          const rect = element.getBoundingClientRect()
          return {
            ...target,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          }
        }
      }
      
      return {
        ...target,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }
    })

    setCursorTargets(targets)
  }, [currentStep])

  // Handle target completion
  const handleTargetComplete = useCallback(() => {
    if (currentTargetIndex < cursorTargets.length - 1) {
      setCurrentTargetIndex(prev => prev + 1)
    } else {
      // All targets complete, move to next stage
      setTimeout(() => {
        if (currentStepIndex < tourSteps.length - 1) {
          setCurrentStepIndex(prev => prev + 1)
          setCurrentTargetIndex(0)
        } else {
          // Tour complete
          onComplete()
        }
      }, 1000)
    }
  }, [currentTargetIndex, cursorTargets.length, currentStepIndex, tourSteps.length, onComplete])

  if (!isActive) return null

  return (
    <>
      {/* Narration Box */}
      <AnimatePresence>
        {narrationVisible && currentStep && (
          <motion.div
            className="tour-narration"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="narration-header">
              <span className="tesla-icon">⚡</span>
              <span className="narration-title">{currentStep.title}</span>
            </div>
            <div className="narration-text">
              {currentStep.narration}
            </div>
            <div className="narration-progress">
              Step {currentStepIndex + 1} of {tourSteps.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Cursor */}
      <GuidedTourCursor
        isActive={isActive}
        targets={cursorTargets}
        currentTargetIndex={currentTargetIndex}
        onTargetComplete={handleTargetComplete}
      />

      {/* Tour Controls */}
      <motion.div
        className="tour-controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          className="tour-control-btn pause-btn"
          onClick={onPause}
          title="Pause Tour"
        >
          ⏸️ Pause
        </button>
        
        <div className="tour-progress-bar">
          <div 
            className="tour-progress-fill"
            style={{ 
              width: `${((currentStepIndex + 1) / tourSteps.length) * 100}%` 
            }}
          />
        </div>

        <div className="tour-info">
          <span className="tour-stage-name">{currentStep?.title}</span>
          <span className="tour-step-count">{currentStepIndex + 1}/{tourSteps.length}</span>
        </div>
      </motion.div>

      {/* Dim Overlay (spotlight effect) */}
      <div className="tour-overlay" />
    </>
  )
}

