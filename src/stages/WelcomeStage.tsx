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
      {/* Museum Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
          border: '3px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '16px',
          padding: '1.5rem 3rem',
          marginBottom: '3rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
        }}
      >
        <h3 style={{ 
          fontSize: '1.4rem', 
          fontWeight: 700,
          color: '#F59E0B',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '3px'
        }}>
          ⚡ Nikola Tesla Discovery Museum ⚡
        </h3>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
          Holographic Hydrogen Fractal MRI Exhibition
        </p>
      </motion.div>

      {/* Centered Hero Section - Story Introduction */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        maxWidth: '900px'
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
          🔬💫🌌
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
          Welcome to the Future of Imaging
        </motion.h2>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'left',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid rgba(6, 182, 212, 0.3)'
          }}
        >
          <p style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: '#06B6D4', fontSize: '1.3em' }}>Your Journey Today:</strong>
          </p>
          
          <div style={{ display: 'grid', gap: '1rem', paddingLeft: '1rem' }}>
            <p>
              <strong style={{ color: '#8B5CF6' }}>1.</strong> Discover how <strong>hydrogen atoms spin</strong> like tiny magnets
            </p>
            <p>
              <strong style={{ color: '#8B5CF6' }}>2.</strong> See how <strong>MRI machines</strong> use this spin to image your body
            </p>
            <p>
              <strong style={{ color: '#8B5CF6' }}>3.</strong> Learn about <strong>holographs</strong> (3D projections) and <strong>fractals</strong> (infinite patterns)
            </p>
            <p>
              <strong style={{ color: '#8B5CF6' }}>4.</strong> Explore <strong>HHF-AI MRI</strong> — A revolutionary system that images not just flesh, but <em>ideas, patterns, and complex systems!</em>
            </p>
            <p>
              <strong style={{ color: '#8B5CF6' }}>5.</strong> See how HHF-AI MRI can <strong>analyze scientific papers</strong> faster and more accurately than human peer review
            </p>
            <p style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid rgba(236, 72, 153, 0.3)' }}>
              <strong style={{ color: '#EC4899', fontSize: '1.2em' }}>Plus:</strong> Build your own HHF-AI MRI experiment and chat with <strong>Nikola Tesla himself!</strong> ⚡
            </p>
          </div>
        </motion.div>
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

      {/* Museum Exhibit Cards - What You'll Learn */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
            borderRadius: '20px',
            border: '3px solid rgba(6, 182, 212, 0.5)',
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.4)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(6, 182, 212, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(6, 182, 212, 0.4)'
          }}
          >
            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚛️</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800,
                marginBottom: '1rem',
                color: '#06B6D4',
                textShadow: '0 0 20px rgba(6, 182, 212, 0.6)'
              }}>
                The Science
              </h3>
            </div>
            <p style={{ 
              lineHeight: 1.7, 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.05rem'
            }}>
              Real MRI physics! Learn how hydrogen atoms spin, how magnetic fields control them, and why this creates detailed images of your body
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
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))',
            borderRadius: '20px',
            border: '3px solid rgba(139, 92, 246, 0.5)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(139, 92, 246, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.4)'
          }}
          >
            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌀</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800,
                marginBottom: '1rem',
                color: '#8B5CF6',
                textShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
              }}>
                The Magic
              </h3>
            </div>
            <p style={{ 
              lineHeight: 1.7, 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.05rem'
            }}>
              Holographs project 3D images in space. Fractals create infinite repeating patterns. Together they unlock new dimensions of imaging!
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
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(245, 158, 11, 0.15))',
            borderRadius: '20px',
            border: '3px solid rgba(236, 72, 153, 0.5)',
            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(236, 72, 153, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(236, 72, 153, 0.4)'
          }}
          >
            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800,
                marginBottom: '1rem',
                color: '#EC4899',
                textShadow: '0 0 20px rgba(236, 72, 153, 0.6)'
              }}>
                The Future
              </h3>
            </div>
            <p style={{ 
              lineHeight: 1.7, 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.05rem'
            }}>
              HHF-AI MRI can image anything — from scientific papers to system coherence. See why it's faster and more accurate than human review!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Museum Time Estimate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '600px'
        }}
      >
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#10B981', 
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          ⏱️ Exhibition Time: 30-45 minutes
        </p>
        <p style={{ 
          fontSize: '0.95rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}>
          Perfect for ages 10+ • Interactive experiments • Ask Tesla anything!
        </p>
      </motion.div>

      {/* Centered Call-to-Action - Perfect Balance */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, type: 'spring', bounce: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1rem'
        }}
      >
        <button
          onClick={onNext}
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            padding: '1.8rem 4.5rem',
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
          🚀 Start Your Discovery Journey 🚀
        </button>
      </motion.div>

      {/* Museum Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          marginTop: '2.5rem',
          textAlign: 'center',
          maxWidth: '700px'
        }}
      >
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontStyle: 'italic',
          marginBottom: '1rem'
        }}>
          💫 Rotate the 3D hydrogen cloud above with your mouse
        </p>
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.5)',
          lineHeight: 1.6
        }}>
          <strong style={{ color: '#F59E0B' }}>Nikola Tesla</strong> will be your personal guide throughout this exhibition! 
          Look for his glowing avatar at the bottom of the screen. Click him anytime to ask questions! ⚡
        </p>
      </motion.div>
    </div>
  )
}

