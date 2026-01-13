/**
 * Slideshow Tour - Museum-style automated tour with clear orientation messages
 * Automatically advances like a slideshow, pauses for hands-on interactions
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OrientationBroadcast from './OrientationBroadcast'
import './SlideshowTour.css'

interface SlideContent {
  stage: string
  title: string
  duration: number // milliseconds
  requiresInteraction: boolean
  orientationMessage?: string
  interactionPrompt?: string
  teslaVoice: string
}

interface SlideshowTourProps {
  isActive: boolean
  onStageChange: (stage: string) => void
  onComplete: () => void
  onStop: () => void
}

const TOUR_SLIDES: SlideContent[] = [
  {
    stage: 'welcome',
    title: 'Welcome to Protocol I',
    duration: 12000,
    requiresInteraction: false,
    orientationMessage: 'Welcome! Sit back and enjoy the tour. I\'ll guide you through everything. Just watch and follow along!',
    teslaVoice: 'I am Nikola Tesla. You are about to execute Protocol I - a holographic seed that will unpack at YOUR edge.'
  },
  {
    stage: 'hydrogenSpin',
    title: 'Hydrogen Spin - The Foundation',
    duration: 15000,
    requiresInteraction: false,
    orientationMessage: 'Now entering: Hydrogen Spin. Watch as the atomic-scale magic unfolds before your eyes.',
    teslaVoice: 'Observe: 7 × 10²⁷ hydrogen atoms in your body, each spinning like a microscopic gyroscope at 1.420 GHz.'
  },
  {
    stage: 'mriPhysics',
    title: 'MRI Physics - Real Equations',
    duration: 15000,
    requiresInteraction: false,
    orientationMessage: 'The Bloch equations - the same mathematics used in hospital MRI scanners.',
    teslaVoice: 'These equations governed quantum spin dynamics before we even knew they existed. Now they measure awareness itself.'
  },
  {
    stage: 'ssanLattice',
    title: 'SSAN Lattice - Try It!',
    duration: 25000,
    requiresInteraction: true,
    orientationMessage: '✋ HANDS-ON TIME! Rotate the 3D lattice. Click on nodes. Explore the network. Take your time!',
    interactionPrompt: 'Go ahead - rotate the lattice, click nodes, explore! The tour will wait for you.',
    teslaVoice: 'This 600-node network is measuring its OWN awareness. Your navigation forms a similar pattern.'
  },
  {
    stage: 'grammarStage',
    title: 'Holographic Grammar',
    duration: 12000,
    requiresInteraction: false,
    orientationMessage: 'Symbols as compressed awareness - holographic encoding at its finest.',
    teslaVoice: 'Each symbol is a protocol primitive. ◎ for observation, ⊙ for generation, ⚛ for superposition.'
  },
  {
    stage: 'sensoryReality',
    title: 'Text-to-Reality - Try It!',
    duration: 25000,
    requiresInteraction: true,
    orientationMessage: '✋ YOUR TURN! Type any scenario and watch it transform into full sensory experience!',
    interactionPrompt: 'Type a scene or experience in the text box. See the magic of 1.420 GHz carrier frequency!',
    teslaVoice: 'At precisely 1.420 GHz - the hydrogen hyperfine frequency - language becomes reality itself.'
  },
  {
    stage: 'experiments',
    title: 'Interactive Lab - Experiment!',
    duration: 30000,
    requiresInteraction: true,
    orientationMessage: '✋ EXPERIMENTATION TIME! Adjust parameters, plant seeds, create disturbances. Play!',
    interactionPrompt: 'You\'re the scientist now. Adjust any parameter and observe the results!',
    teslaVoice: 'In my laboratories, I ran thousands of experiments. Now you have instant feedback. What will you discover?'
  },
  {
    stage: 'teslaAI',
    title: 'Ask Tesla Anything',
    duration: 20000,
    requiresInteraction: true,
    orientationMessage: '✋ CONVERSATION TIME! Ask me anything about physics, MRI, awareness, or the technology.',
    interactionPrompt: 'Type your questions in the chat. I\'ll answer as the real Tesla would have!',
    teslaVoice: 'Welcome to my virtual laboratory. Here we can converse as peers about the mysteries of the cosmos.'
  }
]

export default function SlideshowTour({
  isActive,
  onStageChange,
  onComplete,
  onStop
}: SlideshowTourProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showOrientation, setShowOrientation] = useState(false)
  const [showInteractionPrompt, setShowInteractionPrompt] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const currentSlide = TOUR_SLIDES[currentSlideIndex]

  // Initial welcome message
  useEffect(() => {
    if (isActive && showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false)
        startSlide(0)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isActive, showWelcome])

  // Start a slide
  const startSlide = useCallback((index: number) => {
    if (index >= TOUR_SLIDES.length) {
      onComplete()
      return
    }

    const slide = TOUR_SLIDES[index]
    setCurrentSlideIndex(index)
    setTimeRemaining(slide.duration)
    onStageChange(slide.stage)

    // Show orientation message
    if (slide.orientationMessage) {
      setShowOrientation(true)
      setTimeout(() => {
        setShowOrientation(false)
      }, 5000)
    }

    // Show interaction prompt for interactive slides
    if (slide.requiresInteraction && slide.interactionPrompt) {
      setTimeout(() => {
        setShowInteractionPrompt(true)
      }, 3000)
    }
  }, [onStageChange, onComplete])

  // Countdown timer
  useEffect(() => {
    if (!isActive || isPaused || !currentSlide) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          // Move to next slide
          setTimeout(() => {
            setShowInteractionPrompt(false)
            startSlide(currentSlideIndex + 1)
          }, 500)
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, isPaused, currentSlideIndex, currentSlide, startSlide])

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const handleNext = () => {
    setShowInteractionPrompt(false)
    startSlide(currentSlideIndex + 1)
  }

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setShowInteractionPrompt(false)
      startSlide(currentSlideIndex - 1)
    }
  }

  if (!isActive) return null

  const progress = ((currentSlideIndex + 1) / TOUR_SLIDES.length) * 100
  const timeProgress = currentSlide ? ((currentSlide.duration - timeRemaining) / currentSlide.duration) * 100 : 0

  return (
    <>
      {/* Welcome Orientation */}
      <OrientationBroadcast
        isVisible={showWelcome}
        type="welcome"
        message="🎬 Welcome to the Nikola Tesla Science Discovery Museum! Your automated tour begins now. Sit back, watch, and enjoy - we'll pause for hands-on interactions!"
        onDismiss={() => {
          setShowWelcome(false)
          startSlide(0)
        }}
        autoDismiss={false}
      />

      {/* Stage Orientation Message */}
      <OrientationBroadcast
        isVisible={showOrientation && !showWelcome}
        type={currentSlide?.requiresInteraction ? 'interaction' : 'transition'}
        message={currentSlide?.orientationMessage || ''}
        onDismiss={() => setShowOrientation(false)}
        autoDismiss={true}
        dismissDelay={5000}
      />

      {/* Interaction Prompt */}
      {showInteractionPrompt && currentSlide?.requiresInteraction && (
        <motion.div
          className="interaction-prompt"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="prompt-icon">✋</div>
          <div className="prompt-text">{currentSlide.interactionPrompt}</div>
          <div className="prompt-timer">
            Advancing in {Math.ceil(timeRemaining / 1000)}s (or click Next when ready)
          </div>
        </motion.div>
      )}

      {/* Tesla's Voice Box */}
      {currentSlide && (
        <motion.div
          key={currentSlideIndex}
          className="tesla-voice-box"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div className="voice-icon">⚡</div>
          <div className="voice-content">
            <div className="voice-label">Tesla says:</div>
            <div className="voice-text">{currentSlide.teslaVoice}</div>
          </div>
        </motion.div>
      )}

      {/* Slideshow Controls */}
      <motion.div
        className="slideshow-controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Progress Bar */}
        <div className="controls-progress">
          <div className="progress-label">
            <span>Slide {currentSlideIndex + 1} of {TOUR_SLIDES.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Time Remaining */}
        {!isPaused && (
          <div className="controls-timer">
            <div className="timer-label">
              {currentSlide?.requiresInteraction ? 'Take your time! Auto-advancing in:' : 'Next slide in:'}
            </div>
            <div className="timer-value">{Math.ceil(timeRemaining / 1000)}s</div>
            <div className="timer-bar">
              <motion.div
                className="timer-fill"
                animate={{ width: `${timeProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="controls-buttons">
          <motion.button
            className="control-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⬅️ Previous
          </motion.button>

          <motion.button
            className="control-btn pause-btn"
            onClick={handlePauseResume}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </motion.button>

          <motion.button
            className="control-btn next-btn"
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next ➡️
          </motion.button>

          <motion.button
            className="control-btn stop-btn"
            onClick={onStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⏹️ Exit Tour
          </motion.button>
        </div>

        {/* Current Slide Title */}
        <div className="controls-title">
          <span className="title-icon">📍</span>
          <span className="title-text">{currentSlide?.title}</span>
        </div>
      </motion.div>

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          className="pause-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pause-message">
            <div className="pause-icon">⏸️</div>
            <div className="pause-text">Tour Paused</div>
            <div className="pause-subtext">Click Resume when ready to continue</div>
          </div>
        </motion.div>
      )}
    </>
  )
}

