/**
 * Guided Tour Cursor - Animated pointer that guides users through the demo
 * Automatically moves to important elements and shows training tooltips
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import './GuidedTourCursor.css'

interface CursorTarget {
  x: number
  y: number
  label?: string
  action?: 'click' | 'hover' | 'look'
  duration?: number
}

interface GuidedTourCursorProps {
  isActive: boolean
  targets: CursorTarget[]
  currentTargetIndex: number
  onTargetComplete?: () => void
}

export default function GuidedTourCursor({ 
  isActive, 
  targets, 
  currentTargetIndex,
  onTargetComplete 
}: GuidedTourCursorProps) {
  const [showLabel, setShowLabel] = useState(false)
  
  const currentTarget = targets[currentTargetIndex]

  useEffect(() => {
    if (!currentTarget) return

    // Show label after cursor arrives
    const labelTimer = setTimeout(() => {
      setShowLabel(true)
    }, 1000)

    // Complete target after duration
    const duration = currentTarget.duration || 3000
    const completeTimer = setTimeout(() => {
      setShowLabel(false)
      onTargetComplete?.()
    }, duration + 1000)

    return () => {
      clearTimeout(labelTimer)
      clearTimeout(completeTimer)
    }
  }, [currentTarget, onTargetComplete])

  if (!isActive || !currentTarget) return null

  return (
    <motion.div
      className="guided-tour-cursor"
      animate={{
        x: currentTarget.x,
        y: currentTarget.y
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 1
      }}
      style={{
        position: 'fixed',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      {/* Cursor Icon */}
      <motion.div
        className="cursor-icon"
        animate={{
          scale: currentTarget.action === 'click' ? [1, 0.8, 1] : 1
        }}
        transition={{
          duration: 0.5,
          repeat: currentTarget.action === 'click' ? Infinity : 0
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill="#F59E0B"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))"
          />
        </svg>
      </motion.div>

      {/* Click Animation */}
      {currentTarget.action === 'click' && (
        <motion.div
          className="click-ripple"
          animate={{
            scale: [0, 2],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
      )}

      {/* Tooltip Label */}
      <AnimatePresence>
        {showLabel && currentTarget.label && (
          <motion.div
            className="cursor-tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="tooltip-content">
              {currentTarget.label}
            </div>
            <div className="tooltip-arrow" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight Effect */}
      <motion.div
        className="cursor-spotlight"
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />
    </motion.div>
  )
}

