import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface HelpTooltipProps {
  children: React.ReactNode
  tip: string
}

export default function HelpTooltip({ children, tip }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2, type: 'spring' }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '10px',
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.98), rgba(236, 72, 153, 0.98))',
              border: '3px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 700,
              maxWidth: '250px',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.8), 0 0 60px rgba(236, 72, 153, 0.6)',
              zIndex: 10000,
              whiteSpace: 'normal',
              pointerEvents: 'none',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.5px'
            }}
          >
            💡 {tip}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid rgba(236, 72, 153, 0.98)'
            }}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

