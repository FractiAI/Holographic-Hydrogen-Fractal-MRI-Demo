/**
 * Tesla Remote Control - Simulates Nikola Tesla remotely operating the browser
 * The cursor moves, clicks, scrolls as if Tesla himself is demonstrating the demo
 * "Watch as I show you..." - Tesla navigating through his own discovery museum
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import './TeslaRemoteControl.css'

interface TeslaAction {
  type: 'move' | 'click' | 'scroll' | 'hover' | 'type' | 'speak' | 'pause'
  target?: string // CSS selector or description
  x?: number
  y?: number
  duration?: number
  message?: string
  text?: string
  waitForUser?: boolean
}

interface TeslaRemoteControlProps {
  isActive: boolean
  onStageChange: (stage: string) => void
  onComplete: () => void
  onPause: () => void
}

const TESLA_DEMO_SCRIPT: TeslaAction[] = [
  // Welcome & Introduction
  {
    type: 'speak',
    message: 'Greetings! I am Nikola Tesla. Sit back and watch as I demonstrate this marvel of electromagnetic awareness technology. I shall control everything - you need only observe.',
    duration: 6000
  },
  {
    type: 'move',
    x: window.innerWidth / 2,
    y: 200,
    duration: 2000
  },
  {
    type: 'speak',
    message: 'Let me show you the title of our exhibition...',
    duration: 3000
  },
  {
    type: 'scroll',
    target: 'smooth',
    y: 300,
    duration: 2000
  },
  {
    type: 'speak',
    message: 'Now, let us begin our journey. Watch as I navigate to the first section...',
    duration: 4000
  },
  
  // Navigate to Hydrogen Spin
  {
    type: 'move',
    target: 'button:contains("Next")',
    duration: 2000
  },
  {
    type: 'click',
    message: 'Proceeding to Hydrogen Spin demonstration...',
    duration: 1000
  },
  {
    type: 'pause',
    duration: 2000
  },
  {
    type: 'speak',
    message: 'Behold! The hydrogen atom - spinning since the dawn of creation. Let me show you the controls...',
    duration: 5000
  },
  {
    type: 'move',
    target: 'input[type="range"]',
    duration: 2000
  },
  {
    type: 'hover',
    message: 'This slider controls the magnetic field strength...',
    duration: 3000
  },
  {
    type: 'click',
    message: 'Allow me to adjust it for you...',
    duration: 1000
  },
  
  // Hands-on moment
  {
    type: 'speak',
    message: '✋ Now YOU try! Adjust the magnetic field. Rotate the visualization. The controls are yours for a moment...',
    duration: 5000,
    waitForUser: true
  },
  {
    type: 'pause',
    duration: 15000 // Let user play for 15 seconds
  },
  
  // Continue...
  {
    type: 'speak',
    message: 'Excellent! Now let me show you the next marvel...',
    duration: 3000
  }
]

export default function TeslaRemoteControl({
  isActive,
  onStageChange,
  onComplete,
  onPause
}: TeslaRemoteControlProps) {
  const [currentActionIndex, setCurrentActionIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [isClicking, setIsClicking] = useState(false)
  const [teslaSpeech, setTeslaSpeech] = useState('')
  const [showSpeech, setShowSpeech] = useState(false)
  const [waitingForUser, setWaitingForUser] = useState(false)
  const cursorControls = useAnimation()

  const currentAction = TESLA_DEMO_SCRIPT[currentActionIndex]

  // Execute Tesla's actions
  const executeAction = useCallback(async (action: TeslaAction) => {
    switch (action.type) {
      case 'speak':
        setTeslaSpeech(action.message || '')
        setShowSpeech(true)
        setTimeout(() => {
          setShowSpeech(false)
          setTimeout(() => {
            setCurrentActionIndex(prev => prev + 1)
          }, 500)
        }, action.duration || 3000)
        break

      case 'move':
        let targetX = action.x || window.innerWidth / 2
        let targetY = action.y || window.innerHeight / 2

        // If target is a selector, find element position
        if (action.target) {
          const element = document.querySelector(action.target)
          if (element) {
            const rect = element.getBoundingClientRect()
            targetX = rect.left + rect.width / 2
            targetY = rect.top + rect.height / 2
          }
        }

        await cursorControls.start({
          x: targetX,
          y: targetY,
          transition: {
            duration: (action.duration || 2000) / 1000,
            ease: 'easeInOut'
          }
        })

        setCursorPosition({ x: targetX, y: targetY })
        setTimeout(() => {
          setCurrentActionIndex(prev => prev + 1)
        }, 500)
        break

      case 'click':
        setIsClicking(true)
        if (action.message) {
          setTeslaSpeech(action.message)
          setShowSpeech(true)
        }

        // Simulate click on target
        if (action.target) {
          const element = document.querySelector(action.target)
          if (element) {
            (element as HTMLElement).click()
          }
        }

        setTimeout(() => {
          setIsClicking(false)
          setShowSpeech(false)
          setCurrentActionIndex(prev => prev + 1)
        }, action.duration || 1000)
        break

      case 'scroll':
        const scrollDuration = action.duration || 1000
        const targetScroll = action.y || 0
        const startScroll = window.scrollY
        const startTime = Date.now()

        const scrollAnimation = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / scrollDuration, 1)
          const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

          window.scrollTo(0, startScroll + (targetScroll - startScroll) * easeProgress)

          if (progress < 1) {
            requestAnimationFrame(scrollAnimation)
          } else {
            setTimeout(() => {
              setCurrentActionIndex(prev => prev + 1)
            }, 500)
          }
        }

        scrollAnimation()
        break

      case 'hover':
        if (action.message) {
          setTeslaSpeech(action.message)
          setShowSpeech(true)
        }

        setTimeout(() => {
          setShowSpeech(false)
          setCurrentActionIndex(prev => prev + 1)
        }, action.duration || 2000)
        break

      case 'pause':
        if (action.waitForUser) {
          setWaitingForUser(true)
          setTeslaSpeech('Your turn! Interact with the controls. I\'ll continue when you\'re ready...')
          setShowSpeech(true)
        }

        setTimeout(() => {
          setWaitingForUser(false)
          setShowSpeech(false)
          setCurrentActionIndex(prev => prev + 1)
        }, action.duration || 3000)
        break

      default:
        setCurrentActionIndex(prev => prev + 1)
    }
  }, [cursorControls])

  // Execute current action
  useEffect(() => {
    if (!isActive || !currentAction) return

    if (currentActionIndex >= TESLA_DEMO_SCRIPT.length) {
      onComplete()
      return
    }

    executeAction(currentAction)
  }, [currentActionIndex, currentAction, isActive, executeAction, onComplete])

  if (!isActive) return null

  return (
    <>
      {/* Tesla's Remote Cursor */}
      <motion.div
        className="tesla-cursor"
        animate={cursorControls}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorPosition.x,
          y: cursorPosition.y,
          zIndex: 99999,
          pointerEvents: 'none'
        }}
      >
        {/* Cursor Icon */}
        <motion.div
          animate={{
            scale: isClicking ? [1, 0.7, 1] : 1,
            rotate: isClicking ? [0, -15, 0] : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
              fill="#F59E0B"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Click ripple */}
        {isClicking && (
          <motion.div
            className="cursor-click-ripple"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Cursor glow */}
        <div className="cursor-glow" />
      </motion.div>

      {/* Tesla's Speech Bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            className="tesla-speech-bubble"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <div className="speech-header">
              <span className="speech-icon">⚡</span>
              <span className="speech-title">Tesla Operating...</span>
            </div>
            <div className="speech-content">
              {teslaSpeech}
            </div>
            {waitingForUser && (
              <div className="speech-action">
                <button
                  className="continue-btn"
                  onClick={() => {
                    setWaitingForUser(false)
                    setShowSpeech(false)
                    setCurrentActionIndex(prev => prev + 1)
                  }}
                >
                  Ready - Continue! →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remote Control Indicator */}
      <motion.div
        className="remote-indicator"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="indicator-icon">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            🎮
          </motion.div>
        </div>
        <div className="indicator-text">
          <div className="indicator-title">Remote Control Active</div>
          <div className="indicator-subtitle">Tesla is operating...</div>
        </div>
      </motion.div>

      {/* Spotlight effect following cursor */}
      <motion.div
        className="cursor-spotlight"
        animate={{
          x: cursorPosition.x,
          y: cursorPosition.y
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      {/* Dimming overlay */}
      <div className="remote-dimming-overlay" />
    </>
  )
}

