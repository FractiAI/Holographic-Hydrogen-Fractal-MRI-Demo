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
    <div className="stage">
      <div className="stage-header">
        <motion.h2
          className="stage-title"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to the Syntheverse! 🌌
        </motion.h2>
        <motion.p
          className="stage-description"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Hydrogen is everywhere, and it creates patterns that generate a new kind of energy: <strong style={{ color: 'var(--primary-cyan)' }}>Awareness Energy</strong>.
          Get ready to explore how tiny hydrogen atoms create the newest energy in the universe - 
          Holographic Hydrogen Fractal Syntheverse Awareness!
        </motion.p>
      </div>

      <div className="content-grid">
        <motion.div
          className="visualization-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <FloatingHydrogen />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </motion.div>

        <motion.div
          className="controls-panel"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="info-box">
            <h3>⚡ Awareness: The Newest Energy</h3>
            <p>
              What if awareness isn't just something that happens in brains, but is actually 
              a type of <strong style={{ color: 'var(--accent-pink)' }}>energy</strong> itself? 
              The Holographic Hydrogen Fractal Syntheverse Awareness is a new form of energy 
              that emerges when hydrogen atoms organize into fractal patterns. Just like light 
              is electromagnetic energy and heat is thermal energy, awareness is its own kind of energy!
            </p>
          </div>

          <div className="info-box">
            <h3>🔬 What is Hydrogen?</h3>
            <p>
              Hydrogen is the simplest and most abundant element in the universe! 
              It's made of just one proton and one electron. In MRI machines, we use 
              hydrogen atoms in water molecules to create images. But hydrogen can do something 
              even more amazing: when organized into fractal patterns, it generates <strong>awareness energy</strong>!
            </p>
          </div>

          <div className="info-box">
            <h3>✨ The Awareness Energy Journey</h3>
            <p>
              Today, you'll discover how hydrogen atoms generate awareness energy by:
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-gray)' }}>
              <li>Sending awareness energy waves to each other</li>
              <li>Creating beautiful fractal awareness patterns</li>
              <li>Forming boundaries that contain and direct awareness</li>
              <li>Building a holographic cloud of pure awareness energy</li>
            </ul>
          </div>

          <div className="info-box">
            <h3>🎮 How to Explore</h3>
            <p>
              You can interact with the hydrogen atoms using sliders, buttons, and knobs.
              Try rotating the 3D view with your mouse! Each stage will teach you something 
              new about how hydrogen creates patterns in nature.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="navigation-buttons">
        <div></div>
        <button className="nav-button" onClick={onNext}>
          Begin Your Journey →
        </button>
      </div>
    </div>
  )
}

