import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text, Torus } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface HydrogenSpinStageProps {
  onNext: () => void
  onPrev: () => void
}

// Animated spinning hydrogen atom with visible spin axis
function SpinningHydrogen({ isSpinning, spinSpeed }: { isSpinning: boolean, spinSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const arrowRef = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    if (groupRef.current && isSpinning) {
      // Rotate around Y axis to show spin
      groupRef.current.rotation.y += delta * spinSpeed
    }
    
    // Make the arrow pulse
    if (arrowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      arrowRef.current.scale.set(1, scale, 1)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central hydrogen nucleus (proton) */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#FF6B6B"
          emissive="#FF6B6B"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Electron cloud */}
      <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#4ECDC4"
          transparent
          opacity={0.2}
          emissive="#4ECDC4"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Spin axis arrow going through the atom */}
      <group ref={arrowRef}>
        {/* Vertical line showing axis */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 4, 16]} />
          <meshStandardMaterial
            color="#FFD93D"
            emissive="#FFD93D"
            emissiveIntensity={0.7}
          />
        </mesh>
        
        {/* Arrow head at top */}
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.2, 0.4, 16]} />
          <meshStandardMaterial
            color="#FFD93D"
            emissive="#FFD93D"
            emissiveIntensity={0.7}
          />
        </mesh>

        {/* Labels */}
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.3}
          color="#FFD93D"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          SPIN ⬆
        </Text>
        
        <Text
          position={[0, -2.8, 0]}
          fontSize={0.3}
          color="#FFD93D"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          SPIN ⬇
        </Text>
      </group>

      {/* Magnetic field lines */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const radius = 1.5
        return (
          <Torus
            key={i}
            args={[radius, 0.02, 16, 100]}
            position={[0, Math.sin(rad) * 0.5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color="#A78BFA"
              emissive="#A78BFA"
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
            />
          </Torus>
        )
      })}
    </group>
  )
}

export default function HydrogenSpinStage({ onNext, onPrev }: HydrogenSpinStageProps) {
  const [isSpinning, setIsSpinning] = useState(true)
  const [spinSpeed, setSpinSpeed] = useState(2)
  const [currentFact, setCurrentFact] = useState(0)

  const facts = [
    {
      title: "🎯 What is Spin?",
      content: "Every hydrogen atom spins like a tiny top! This spinning creates a magnetic field, turning each atom into a microscopic magnet."
    },
    {
      title: "⬆️⬇️ Two Directions",
      content: "Hydrogen can spin UP or DOWN. Just like a compass needle can point North or South, hydrogen spins align with magnetic fields."
    },
    {
      title: "🧲 Natural Magnets",
      content: "Because hydrogen spins create magnetic fields, we can control them with stronger magnets. This is how MRI machines work!"
    },
    {
      title: "💫 Always Spinning",
      content: "Hydrogen atoms NEVER stop spinning! This spin is a fundamental quantum property - it's part of what makes hydrogen... hydrogen!"
    },
    {
      title: "🌊 Precession Motion",
      content: "Like a wobbling top, spinning hydrogen atoms precess (wobble) around magnetic fields. This wobbling is what MRI detects!"
    }
  ]

  return (
    <div className="stage">
      <div className="stage-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="stage-title">⚛️ What is Hydrogen Spin?</h2>
          <p className="stage-description">
            The foundation of MRI technology starts with a simple fact: 
            <strong style={{ color: 'var(--accent-orange)' }}> hydrogen atoms spin like tiny magnets!</strong>
          </p>
        </motion.div>
      </div>

      <div className="content-grid">
        {/* 3D Visualization */}
        <div className="visualization-panel" style={{ minHeight: '600px' }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#FFD93D" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ECDC4" />
            <pointLight position={[0, 10, 0]} intensity={0.8} color="#A78BFA" />
            <SpinningHydrogen isSpinning={isSpinning} spinSpeed={spinSpeed} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
          
          {/* Legend overlay - positioned at top right */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            border: '2px solid rgba(255, 217, 61, 0.5)',
            fontSize: '0.8rem',
            maxWidth: '200px',
            backdropFilter: 'blur(4px)'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#FFD93D', fontWeight: 700, fontSize: '0.85rem' }}>Legend:</p>
            <p style={{ margin: '0.25rem 0', color: '#FF6B6B', fontSize: '0.75rem' }}>🔴 Proton</p>
            <p style={{ margin: '0.25rem 0', color: '#4ECDC4', fontSize: '0.75rem' }}>🔵 Electrons</p>
            <p style={{ margin: '0.25rem 0', color: '#FFD93D', fontSize: '0.75rem' }}>⬆️ Spin Axis</p>
            <p style={{ margin: '0.25rem 0', color: '#A78BFA', fontSize: '0.75rem' }}>🟣 Magnetic Field</p>
          </div>
        </div>

        {/* Interactive Controls and Facts */}
        <div className="controls-panel">
          {/* Interactive Controls */}
          <div className="control-group">
            <div className="control-label">
              <span>🎡 Spin Control</span>
            </div>
            <div className="button-group">
              <button 
                onClick={() => setIsSpinning(!isSpinning)}
                style={{
                  background: isSpinning 
                    ? 'linear-gradient(135deg, #10B981, #059669)' 
                    : 'linear-gradient(135deg, #EF4444, #DC2626)'
                }}
              >
                {isSpinning ? '⏸️ Pause Spin' : '▶️ Start Spin'}
              </button>
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>⚡ Spin Speed</span>
              <span className="control-value">{spinSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={spinSpeed}
              onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Real hydrogen spins millions of times per second! We've slowed it down so you can see it.
            </p>
          </div>

          {/* Educational Facts Carousel */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(255, 217, 61, 0.2), rgba(78, 205, 196, 0.2))',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ color: '#FFD93D', marginBottom: '1rem' }}>
                {facts[currentFact].title}
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                {facts[currentFact].content}
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '2px solid rgba(255, 217, 61, 0.3)'
            }}>
              <button
                onClick={() => setCurrentFact((prev) => (prev - 1 + facts.length) % facts.length)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 217, 61, 0.2)',
                  border: '2px solid rgba(255, 217, 61, 0.5)',
                  borderRadius: '8px',
                  color: '#FFD93D',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                ← Previous
              </button>
              
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                {currentFact + 1} / {facts.length}
              </span>
              
              <button
                onClick={() => setCurrentFact((prev) => (prev + 1) % facts.length)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 217, 61, 0.2)',
                  border: '2px solid rgba(255, 217, 61, 0.5)',
                  borderRadius: '8px',
                  color: '#FFD93D',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))' 
          }}>
            <h3 style={{ color: '#10B981' }}>✅ Key Takeaways</h3>
            <ul style={{ 
              paddingLeft: '1.5rem', 
              margin: '1rem 0 0 0',
              lineHeight: 2,
              fontSize: '0.95rem'
            }}>
              <li>Hydrogen atoms <strong>spin</strong> like tiny tops</li>
              <li>This spin creates a <strong>magnetic field</strong></li>
              <li>We can control spin with <strong>stronger magnets</strong></li>
              <li>MRI detects the <strong>wobbling</strong> of spinning hydrogen</li>
              <li>Your body is <strong>~60% hydrogen</strong> (in water!)</li>
            </ul>
          </div>

          {/* Fun Fact */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(245, 158, 11, 0.2))',
            border: '2px solid rgba(236, 72, 153, 0.4)'
          }}>
            <h3 style={{ color: '#EC4899' }}>🤯 Mind-Blowing Fact!</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
              There are about <strong style={{ color: '#F59E0B', fontSize: '1.2em' }}>
              7 BILLION BILLION BILLION</strong> (7 × 10²⁷) hydrogen atoms in your body right now — 
              and they're ALL spinning! That's more hydrogen atoms than there are stars in the universe!
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back to Welcome
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: How MRI Works →
        </button>
      </div>
    </div>
  )
}

