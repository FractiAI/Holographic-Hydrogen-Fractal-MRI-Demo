import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface WelcomeStageProps {
  onNext: () => void
  onStartTour?: () => void
  onTeslaLabShortcut?: () => void // DEV: Direct access to Tesla's Lab offer
}

function FloatingHydrogen() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  // Create multiple floating hydrogen atoms
  const atoms = Array.from({ length: 25 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
    ] as [number, number, number],
    scale: 0.2 + Math.random() * 0.4,
    speed: 0.5 + Math.random() * 1.5,
    offset: i * 0.4,
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

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + offset) * 2
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.3
      
      const pulse = Math.sin(state.clock.elapsedTime * 2 + offset) * 0.3 + 1
      meshRef.current.scale.setScalar(scale * pulse)
    }
  })

  return (
    <Sphere ref={meshRef} args={[scale, 32, 32]} position={position}>
      <meshStandardMaterial
        color="#06B6D4"
        emissive="#8B5CF6"
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
      />
    </Sphere>
  )
}

// Animated Tesla Avatar
function AnimatedTesla() {
  const teslaRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (teslaRef.current) {
      teslaRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.5
      teslaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={teslaRef} position={[0, 0, 0]}>
      {/* Tesla's Electric Aura */}
      <Sphere args={[3, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#EC4899"
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Tesla Label */}
      <Html position={[0, 3.5, 0]} center>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            textShadow: [
              '0 0 20px rgba(245, 158, 11, 0.8)',
              '0 0 40px rgba(245, 158, 11, 1)',
              '0 0 20px rgba(245, 158, 11, 0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: '4rem',
            filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 1))'
          }}
        >
          ⚡
        </motion.div>
      </Html>
    </group>
  )
}

export default function WelcomeStage({ onNext, onStartTour, onTeslaLabShortcut }: WelcomeStageProps) {
  const [teslaMessage, setTeslaMessage] = useState(0)
  
  const teslaMessages = [
    "I am Nikola Tesla. You are about to execute Protocol I.",
    "This museum is not a tutorial - it is a holographic seed.",
    "The protocol will unpack at YOUR edge, revealing what you are ready to comprehend."
  ]

  return (
    <div className="stage" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      maxWidth: '1600px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      
      {/* Hero Section with Animated Tesla */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
        style={{
          width: '100%',
          maxWidth: '1400px',
          height: '500px',
          marginBottom: '2rem',
          borderRadius: '30px',
          overflow: 'hidden',
          border: '5px solid rgba(245, 158, 11, 0.8)',
          boxShadow: `
            0 0 80px rgba(245, 158, 11, 0.6),
            0 0 120px rgba(139, 92, 246, 0.4),
            inset 0 0 80px rgba(6, 182, 212, 0.2)
          `,
          background: 'radial-gradient(circle, rgba(2, 6, 23, 0.9), rgba(15, 23, 42, 0.95))',
          position: 'relative'
        }}
      >
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[15, 15, 15]} intensity={1.5} color="#F59E0B" />
          <pointLight position={[-15, -15, -15]} intensity={1} color="#8B5CF6" />
          <pointLight position={[0, 15, -15]} intensity={0.8} color="#EC4899" />
          <AnimatedTesla />
          <FloatingHydrogen />
          <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
        
        {/* Tesla's Speech Bubble */}
        <motion.div
          key={teslaMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'absolute',
            top: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(236, 72, 153, 0.95))',
            padding: '1.5rem 2.5rem',
            borderRadius: '20px',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
            maxWidth: '80%',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setTeslaMessage((teslaMessage + 1) % teslaMessages.length)}
        >
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'white',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            {teslaMessages[teslaMessage]}
          </p>
        </motion.div>
      </motion.div>

      {/* Main Title - Syntheverse Narrative */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '1200px' }}
      >
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 900,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #F59E0B, #EC4899, #8B5CF6, #06B6D4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '3px',
          lineHeight: 1.1,
          textShadow: '0 0 40px rgba(245, 158, 11, 0.5)'
        }}>
          WELCOME TO THE SYNTHEVERSE
        </h1>
        <motion.p
          animate={{
            textShadow: [
              '0 0 20px rgba(6, 182, 212, 0.6)',
              '0 0 40px rgba(6, 182, 212, 1)',
              '0 0 20px rgba(6, 182, 212, 0.6)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            fontWeight: 700,
            color: '#06B6D4',
            letterSpacing: '2px'
          }}
        >
          Where Hydrogen Becomes Holographic • Where Fractals Meet Awareness
        </motion.p>
      </motion.div>

      {/* The Big Idea - Discovery Museum Style */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
          border: '4px solid rgba(245, 158, 11, 0.6)',
          borderRadius: '25px',
          padding: '3rem',
          marginBottom: '3rem',
          maxWidth: '1200px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
        }}
      >
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 800,
          color: '#F59E0B',
          marginBottom: '1.5rem',
          textAlign: 'center',
          textShadow: '0 0 30px rgba(245, 158, 11, 0.8)'
        }}>
          🌟 What If We Could Image MORE Than Just Bodies? 🌟
        </h2>
        
        <div style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          lineHeight: 1.9,
          color: 'rgba(255, 255, 255, 0.95)',
          textAlign: 'left'
        }}>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: '#06B6D4', fontSize: '1.2em' }}>Imagine this:</strong> Your body is made of tiny hydrogen atoms. 
            They spin like microscopic magnets. MRI machines use this spin to take pictures of your insides!
          </p>
          
          <p style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: '#8B5CF6', fontSize: '1.2em' }}>But here's the AMAZING part:</strong> What if we could use 
            the SAME hydrogen spin technology to image <em style={{ color: '#EC4899' }}>ideas, patterns, and entire systems?</em>
          </p>
          
          <p style={{ 
            marginBottom: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(236, 72, 153, 0.2)',
            borderLeft: '5px solid #EC4899',
            borderRadius: '10px'
          }}>
            <strong style={{ color: '#EC4899', fontSize: '1.3em' }}>That's the SYNTHEVERSE!</strong> A new frontier where we use 
            <strong> Holographic Hydrogen Fractal MRI (HHF-AI MRI)</strong> to scan not just flesh and bone, but 
            <em> awareness, coherence, and complex patterns!</em>
          </p>

          <p style={{ textAlign: 'center', fontSize: '1.3em', fontWeight: 700, color: '#F59E0B', marginTop: '2rem' }}>
            ⚡ Join Tesla on this electrifying journey! ⚡
          </p>
        </div>
      </motion.div>

      {/* Discovery Cards - What You'll Experience */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px',
          marginBottom: '3rem'
        }}
      >
        {[
          { icon: '⚛️', title: 'Spin Like Hydrogen', desc: 'See atoms dance and spin in 3D! Control magnetic fields with your own hands!', color: '#06B6D4' },
          { icon: '🌀', title: 'Fractals Forever', desc: 'Zoom into infinite patterns! Watch holographs project in 3D space!', color: '#8B5CF6' },
          { icon: '🧠', title: 'Mind-Blowing MRI', desc: 'The MRI that images ITSELF! See awareness become visible!', color: '#EC4899' },
          { icon: '🚀', title: 'Build Your Own', desc: 'Create your own HHF-AI experiment! Plant seeds, shake edges, watch magic!', color: '#F59E0B' }
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -10 }}
            style={{
              background: `linear-gradient(135deg, ${card.color}22, ${card.color}11)`,
              border: `3px solid ${card.color}`,
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 10px 30px ${card.color}40`
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{card.icon}</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 800,
              marginBottom: '1rem',
              color: card.color,
              textShadow: `0 0 20px ${card.color}80`
            }}>
              {card.title}
            </h3>
            <p style={{ 
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              {card.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* The Big Button - Start Discovery */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8, type: 'spring', bounce: 0.6 }}
        style={{ marginBottom: '2rem' }}
      >
        <motion.button
          onClick={onStartTour || onNext}
          whileHover={{ scale: 1.1, y: -10 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 60px rgba(245, 158, 11, 0.6), 0 0 100px rgba(236, 72, 153, 0.4)',
              '0 0 100px rgba(245, 158, 11, 0.9), 0 0 140px rgba(236, 72, 153, 0.7)',
              '0 0 60px rgba(245, 158, 11, 0.6), 0 0 100px rgba(236, 72, 153, 0.4)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
            fontWeight: 900,
            padding: '2rem 4rem',
            background: 'linear-gradient(135deg, #F59E0B, #EC4899, #8B5CF6)',
            border: '5px solid white',
            borderRadius: '25px',
            color: 'white',
            cursor: 'pointer',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '2.5rem' }}
          >
            ⚡
          </motion.span>
          Begin Tesla's Tour
          <motion.span
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '2.5rem' }}
          >
            ⚡
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Tour Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          marginBottom: '2rem'
        }}
      >
        <p style={{
          fontSize: '1.2rem',
          color: '#10B981',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          ⏱️ 12 Interactive Stops • Self-Paced • 30-45 Minutes
        </p>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: 1.8
        }}>
          Perfect for curious minds ages 10+ • Rotate the 3D scenes • Ask Tesla questions anytime! 
          <br />
          <strong style={{ color: '#F59E0B' }}>Your guide awaits! ⚡</strong>
        </p>
      </motion.div>

      {/* DEV ONLY: Direct Access to Tesla's Lab Special Offer */}
      {onTeslaLabShortcut && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(236, 72, 153, 0.1))',
            borderRadius: '20px',
            border: '2px dashed rgba(245, 158, 11, 0.5)',
            maxWidth: '600px'
          }}
        >
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(245, 158, 11, 0.8)',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🔧 Developer Preview Mode 🔧
          </p>
          <motion.button
            onClick={onTeslaLabShortcut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #F59E0B, #EC4899)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>💎</span>
            Skip to Tesla's Lab Special Offer
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
          </motion.button>
          <p style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '1rem',
            fontStyle: 'italic'
          }}>
            (This button will be removed at release)
          </p>
        </motion.div>
      )}
    </div>
  )
}
