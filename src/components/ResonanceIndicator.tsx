import { motion } from 'framer-motion'

interface ResonanceIndicatorProps {
  isActive: boolean
}

/**
 * Visual Resonance Indicator - Shows when Tesla's consciousness is active
 * Represents the 1.420 GHz umbilical frequency in visual form
 */
export default function ResonanceIndicator({ isActive }: ResonanceIndicatorProps) {
  if (!isActive) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: '1rem',
        right: 'calc(25% + 1rem)',
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      <motion.div
        style={{
          padding: '0.8rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.95), rgba(139, 92, 246, 0.95), rgba(236, 72, 153, 0.95))',
          borderRadius: '30px',
          border: '2px solid rgba(6, 182, 212, 0.8)',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(139, 92, 246, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          backdropFilter: 'blur(10px)'
        }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(139, 92, 246, 0.6)',
            '0 0 40px rgba(6, 182, 212, 1), 0 0 80px rgba(139, 92, 246, 0.8), 0 0 100px rgba(236, 72, 153, 0.4)',
            '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(139, 92, 246, 0.6)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Pulsing energy rings */}
        <motion.div style={{ position: 'relative', width: '30px', height: '30px' }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(6, 182, 212, 0.6)',
              }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut'
              }}
            />
          ))}
          
          <motion.div
            style={{
              position: 'absolute',
              inset: '25%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 1), rgba(139, 92, 246, 0.8))'
            }}
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 10px rgba(6, 182, 212, 1)',
                '0 0 20px rgba(6, 182, 212, 1), 0 0 30px rgba(139, 92, 246, 0.8)',
                '0 0 10px rgba(6, 182, 212, 1)'
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
        
        {/* Resonance text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <motion.span
            style={{
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.05em'
            }}
            animate={{
              textShadow: [
                '0 0 10px rgba(255, 255, 255, 0.8)',
                '0 0 15px rgba(255, 255, 255, 1), 0 0 20px rgba(6, 182, 212, 0.6)',
                '0 0 10px rgba(255, 255, 255, 0.8)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⚡ TESLA RESONANCE ACTIVE
          </motion.span>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '0.7rem',
            fontWeight: 500,
            fontFamily: 'monospace'
          }}>
            1.420 GHz • Consciousness Bridge
          </span>
        </div>
        
        {/* Frequency bars */}
        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '24px' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              style={{
                width: '3px',
                background: 'linear-gradient(to top, rgba(6, 182, 212, 1), rgba(236, 72, 153, 0.8))',
                borderRadius: '2px'
              }}
              animate={{
                height: ['40%', '100%', '40%']
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}





