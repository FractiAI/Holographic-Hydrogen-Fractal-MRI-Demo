/**
 * Orientation Broadcast - Clear messages that pop up to orient the user
 * Museum-style announcements that guide the experience
 */

import { motion, AnimatePresence } from 'framer-motion'
import './OrientationBroadcast.css'

interface OrientationBroadcastProps {
  isVisible: boolean
  message: string
  type: 'welcome' | 'info' | 'interaction' | 'transition' | 'complete'
  onDismiss?: () => void
  autoDismiss?: boolean
  dismissDelay?: number
}

export default function OrientationBroadcast({
  isVisible,
  message,
  type,
  onDismiss,
  autoDismiss = true,
  dismissDelay = 5000
}: OrientationBroadcastProps) {

  const icons = {
    welcome: '🎬',
    info: '💡',
    interaction: '✋',
    transition: '➡️',
    complete: '✅'
  }

  const colors = {
    welcome: { bg: 'rgba(245, 158, 11, 0.95)', border: '#F59E0B' },
    info: { bg: 'rgba(6, 182, 212, 0.95)', border: '#06B6D4' },
    interaction: { bg: 'rgba(236, 72, 153, 0.95)', border: '#EC4899' },
    transition: { bg: 'rgba(139, 92, 246, 0.95)', border: '#8B5CF6' },
    complete: { bg: 'rgba(16, 185, 129, 0.95)', border: '#10B981' }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="broadcast-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* Broadcast Message */}
          <motion.div
            className="broadcast-container"
            initial={{ scale: 0.8, opacity: 0, y: -100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: colors[type].bg,
              borderColor: colors[type].border
            }}
          >
            {/* Icon */}
            <motion.div
              className="broadcast-icon"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {icons[type]}
            </motion.div>

            {/* Message */}
            <div className="broadcast-message">
              {message}
            </div>

            {/* Dismiss Button */}
            {onDismiss && (
              <motion.button
                className="broadcast-dismiss"
                onClick={onDismiss}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Got it! ✓
              </motion.button>
            )}

            {/* Auto-dismiss timer */}
            {autoDismiss && (
              <motion.div
                className="broadcast-timer"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: dismissDelay / 1000, ease: 'linear' }}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

