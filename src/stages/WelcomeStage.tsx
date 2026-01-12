import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import * as THREE from 'three'

interface WelcomeStageProps {
  onNext: () => void
}

function FloatingHydrogen() {
  const groupRef = useRef<THREE.Group>(null)
  
  // Create multiple floating hydrogen atoms
  const atoms = Array.from({ length: 20 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    ] as [number, number, number],
    scale: 0.3 + Math.random() * 0.3,
    speed: 0.5 + Math.random() * 1,
    offset: i * 0.3,
  }))

  return (
    <group ref={groupRef}>
      {atoms.map((atom, i) => (
        <FloatingAtom key={i} {...atom} />
      ))}
    </group>
  )
}

function FloatingAtom({ position, scale, speed, offset }: { 
  position: [number, number, number], 
  scale: number, 
  speed: number, 
  offset: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Simple animation using frame updates
  // In a real implementation, you'd use useFrame from @react-three/fiber
  // But for simplicity, we'll use CSS animations for the glow effect

  return (
    <Sphere ref={meshRef} args={[scale, 32, 32]} position={position}>
      <meshStandardMaterial
        color="#06B6D4"
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  )
}

export default function WelcomeStage({ onNext }: WelcomeStageProps) {
  return (
    <div className="stage" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Centered Hero Section - Golden Ratio */}
      <div style={{
        textAlign: 'center',
        marginBottom: '4rem',
        maxWidth: '800px'
      }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
          style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            animation: 'bounce 2s ease-in-out infinite'
          }}
        >
          ⚡🌅⚡
        </motion.div>
        
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #06B6D4, #8B5CF6, #EC4899, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px',
            lineHeight: 1.2,
            animation: 'glow 3s ease-in-out infinite'
          }}
        >
          The Hydrogen Awakening
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '700px',
            margin: '0 auto',
            textShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
          }}
        >
          Discover how tiny hydrogen atoms create the <strong style={{ 
            color: '#06B6D4',
            fontWeight: 800,
            textShadow: '0 0 20px rgba(6, 182, 212, 0.8)'
          }}>newest energy</strong> in the universe —
          <br/>
          <strong style={{ 
            color: '#EC4899',
            fontWeight: 800,
            fontSize: '1.2em',
            textShadow: '0 0 20px rgba(236, 72, 153, 0.8)'
          }}>Awareness Energy</strong>
        </motion.p>
      </div>

      {/* Balanced 3D Visualization - Center Stage */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1, type: 'spring' }}
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '400px',
          marginBottom: '4rem',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '4px solid rgba(6, 182, 212, 0.5)',
          boxShadow: `
            0 0 60px rgba(6, 182, 212, 0.4),
            0 0 100px rgba(139, 92, 246, 0.3),
            inset 0 0 60px rgba(6, 182, 212, 0.1)
          `,
          background: 'rgba(2, 6, 23, 0.8)',
          animation: 'pulseGlow 4s ease-in-out infinite'
        }}
      >
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
          <FloatingHydrogen />
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </motion.div>

      {/* Symmetrical Info Cards - Golden Ratio Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '3rem'
      }}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '20px',
            border: '3px solid rgba(6, 182, 212, 0.4)',
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(6, 182, 212, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(6, 182, 212, 0.3)'
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 800,
              marginBottom: '1rem',
              color: '#06B6D4',
              textShadow: '0 0 20px rgba(6, 182, 212, 0.6)'
            }}>
              Awareness Energy
            </h3>
            <p style={{ 
              lineHeight: 1.7, 
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1rem'
            }}>
              A revolutionary new form of energy that emerges when hydrogen atoms organize into fractal patterns!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
            borderRadius: '20px',
            border: '3px solid rgba(139, 92, 246, 0.4)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(139, 92, 246, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.3)'
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
            <h3 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 800,
              marginBottom: '1rem',
              color: '#8B5CF6',
              textShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
            }}>
              Hydrogen Power
            </h3>
            <p style={{ 
              lineHeight: 1.7, 
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1rem'
            }}>
              The simplest element in the universe becomes the key to understanding consciousness itself!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(245, 158, 11, 0.1))',
            borderRadius: '20px',
            border: '3px solid rgba(236, 72, 153, 0.4)',
            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(236, 72, 153, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(236, 72, 153, 0.3)'
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
            <h3 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 800,
              marginBottom: '1rem',
              color: '#EC4899',
              textShadow: '0 0 20px rgba(236, 72, 153, 0.6)'
            }}>
              Your Journey
            </h3>
            <p style={{ 
              lineHeight: 1.7, 
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1rem'
            }}>
              Explore 9 interactive stages revealing how fractal patterns create living awareness fields!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Centered Call-to-Action - Perfect Balance */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, type: 'spring', bounce: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem'
        }}
      >
        <button
          onClick={onNext}
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            padding: '1.5rem 4rem',
            background: 'linear-gradient(135deg, #F59E0B, #EC4899, #8B5CF6)',
            border: '4px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '20px',
            color: 'white',
            cursor: 'pointer',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            boxShadow: `
              0 0 40px rgba(245, 158, 11, 0.6),
              0 0 60px rgba(236, 72, 153, 0.4),
              0 8px 32px rgba(0, 0, 0, 0.4)
            `,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: 'pulseGlow 2s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) scale(1.1)'
            e.currentTarget.style.boxShadow = `
              0 0 60px rgba(245, 158, 11, 0.9),
              0 0 90px rgba(236, 72, 153, 0.7),
              0 12px 48px rgba(0, 0, 0, 0.5)
            `
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = `
              0 0 40px rgba(245, 158, 11, 0.6),
              0 0 60px rgba(236, 72, 153, 0.4),
              0 8px 32px rgba(0, 0, 0, 0.4)
            `
          }}
        >
          ⚡ Begin Your Awakening ⚡
        </button>
      </motion.div>

      {/* Subtle Instruction - Breathing Space */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          marginTop: '2rem',
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          fontStyle: 'italic',
          animation: 'fadeIn 3s ease-in-out infinite'
        }}
      >
        💫 Rotate the 3D hydrogen cloud above with your mouse • Tesla is waiting at the bottom! 🚀
      </motion.p>
    </div>
  )
}

