import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  emoji: string
  color: string
}

interface DiscoveryParticlesProps {
  trigger: number
}

const EMOJIS = ['⚡', '✨', '🌟', '💫', '⭐', '🔬', '🧪', '🎉']
const COLORS = ['#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#10B981']

export default function DiscoveryParticles({ trigger }: DiscoveryParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger > 0) {
      // Create burst of particles
      const newParticles: Particle[] = []
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        })
      }
      setParticles(newParticles)

      // Clear particles after animation
      setTimeout(() => setParticles([]), 2000)
    }
  }, [trigger])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 99999
    }}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: particle.x,
              y: particle.y
            }}
            animate={{ 
              opacity: 0,
              scale: 2,
              x: particle.x + (Math.random() - 0.5) * 200,
              y: particle.y - 200 + (Math.random() - 0.5) * 100,
              rotate: Math.random() * 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              fontSize: '3rem',
              filter: `drop-shadow(0 0 10px ${particle.color})`,
              textShadow: `0 0 20px ${particle.color}`
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

