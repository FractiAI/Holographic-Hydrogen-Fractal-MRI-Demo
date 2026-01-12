import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface AutoTourControllerProps {
  isActive: boolean
  currentStage: number
  totalStages: number
  onPause: () => void
  onResume: () => void
  onStop: () => void
  timeRemaining: number
  stageDuration: number
}

/**
 * Auto Tour Controller - Visual feedback and controls for the guided tour
 */
export default function AutoTourController({
  isActive,
  currentStage,
  totalStages,
  onPause,
  onResume,
  onStop,
  timeRemaining,
  stageDuration
}: AutoTourControllerProps) {
  const [isPaused, setIsPaused] = useState(false)
  
  const handlePauseResume = () => {
    if (isPaused) {
      onResume()
      setIsPaused(false)
    } else {
      onPause()
      setIsPaused(true)
    }
  }
  
  const handleStop = () => {
    onStop()
    setIsPaused(false)
  }
  
  const progress = ((currentStage + 1) / totalStages) * 100
  const timeProgress = ((stageDuration - timeRemaining) / stageDuration) * 100
  
  if (!isActive) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          pointerEvents: 'auto'
        }}
      >
        <motion.div
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.95), rgba(139, 92, 246, 0.95), rgba(236, 72, 153, 0.95))',
            backdropFilter: 'blur(20px)',
            padding: '1.5rem 2rem',
            borderRadius: '20px',
            border: '3px solid rgba(6, 182, 212, 0.8)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(6, 182, 212, 0.4)',
            minWidth: '500px',
            maxWidth: '90vw'
          }}
          animate={{
            boxShadow: [
              '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(6, 182, 212, 0.4)',
              '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(6, 182, 212, 0.6), 0 0 100px rgba(139, 92, 246, 0.4)',
              '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(6, 182, 212, 0.4)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  fontSize: '1.5rem',
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))'
                }}
              >
                ⚡
              </motion.div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  color: 'white', 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  {isPaused ? '⏸️ Tour Paused' : '🎬 Nikola Tesla\'s Guided Tour'}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  Stage {currentStage + 1} of {totalStages} • {isPaused ? 'Paused' : `Next in ${Math.ceil(timeRemaining / 1000)}s`}
                </p>
              </div>
            </div>
            
            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePauseResume}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStop}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(239, 68, 68, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}
              >
                ⏹️ Stop Tour
              </motion.button>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div style={{ marginBottom: '0.8rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.4rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600
            }}>
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: 'rgba(0, 0, 0, 0.3)', 
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981, #06B6D4, #8B5CF6)',
                  borderRadius: '10px',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Stage Timer */}
          {!isPaused && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.4rem',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600
              }}>
                <span>Current Stage Time</span>
                <span>{Math.ceil(timeRemaining / 1000)}s</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '6px', 
                background: 'rgba(0, 0, 0, 0.3)', 
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #F59E0B, #EC4899)',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.6)'
                  }}
                  animate={{ width: `${timeProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}
          
          {/* Pause Message */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '0.5rem',
                padding: '0.8rem',
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                textAlign: 'center'
              }}
            >
              <p style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                ⏸️ Tour paused. Take your time exploring this stage!
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}



