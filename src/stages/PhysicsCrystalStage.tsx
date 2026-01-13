import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, MeshDistortMaterial } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface PhysicsCrystalStageProps {
  onNext: () => void
  onPrev: () => void
}

// Fluid Physics Crystal that fills all space
function FluidPhysicsCrystal({ mode }: { mode: 'putty' | 'water' | 'crystal' }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      
      if (mode === 'putty') {
        // Putty-like deformation - slowly morphs
        meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.3
        meshRef.current.rotation.y = time * 0.1
        meshRef.current.scale.setScalar(1 + Math.sin(time * 0.3) * 0.1)
      } else if (mode === 'water') {
        // Water-like flow - ripples and waves
        meshRef.current.rotation.y = time * 0.2
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.3
      } else if (mode === 'crystal') {
        // Crystal-like structure - sharp facets, stable
        meshRef.current.rotation.x = time * 0.05
        meshRef.current.rotation.y = time * 0.08
        meshRef.current.rotation.z = time * 0.03
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <icosahedronGeometry args={[2, 4]} />
      <MeshDistortMaterial
        color={
          mode === 'putty' ? '#EC4899' :
          mode === 'water' ? '#06B6D4' :
          '#8B5CF6'
        }
        metalness={mode === 'crystal' ? 0.9 : 0.3}
        roughness={mode === 'water' ? 0.1 : mode === 'putty' ? 0.6 : 0.2}
        distort={mode === 'putty' ? 0.6 : mode === 'water' ? 0.4 : 0.2}
        speed={mode === 'water' ? 3 : mode === 'putty' ? 1 : 0.5}
        transparent
        opacity={mode === 'water' ? 0.7 : 0.9}
        emissive={
          mode === 'putty' ? '#EC4899' :
          mode === 'water' ? '#06B6D4' :
          '#8B5CF6'
        }
        emissiveIntensity={hovered ? 0.8 : 0.3}
      />
    </mesh>
  )
}

// Filling Cracks Animation - Shows physics flowing into all spaces
function FillingCracksVisualization({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 5000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Start particles in "cracks" - irregular distribution
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 3
      const crack = Math.random() > 0.5 ? 1 : -1
      
      positions[i * 3] = Math.cos(angle) * radius * crack
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5
      positions[i * 3 + 2] = Math.sin(angle) * radius * crack
      
      // Color based on position (energy level)
      const hue = ((positions[i * 3 + 1] + 2.5) / 5) * 0.7 // 0.0 to 0.7 (cyan to magenta)
      const color = new THREE.Color().setHSL(hue, 1, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return { positions, colors, count }
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current && active) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < particles.count; i++) {
        // Particles flow to fill all spaces - like water finding level
        const x = positions[i * 3]
        const y = positions[i * 3 + 1]
        const z = positions[i * 3 + 2]
        
        // Flow toward center (zero point) but maintain some chaos
        positions[i * 3] = x * 0.99 + Math.sin(time + i * 0.01) * 0.01
        positions[i * 3 + 1] = y * 0.99 + Math.cos(time + i * 0.01) * 0.01
        positions[i * 3 + 2] = z * 0.99 + Math.sin(time * 0.5 + i * 0.01) * 0.01
        
        // If too close to center, respawn in a crack
        const dist = Math.sqrt(x*x + y*y + z*z)
        if (dist < 0.5) {
          const angle = Math.random() * Math.PI * 2
          const radius = 2 + Math.random() * 3
          positions[i * 3] = Math.cos(angle) * radius
          positions[i * 3 + 1] = (Math.random() - 0.5) * 5
          positions[i * 3 + 2] = Math.sin(angle) * radius
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Harmonic Zero Visualization - The still point at the center
function HarmonicZero() {
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (sphereRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1
      sphereRef.current.scale.setScalar(pulse)
    }
  })
  
  return (
    <group>
      {/* Core zero point */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
        />
      </mesh>
      
      {/* Concentric harmonic shells */}
      {[1, 1.5, 2, 2.5].map((radius, i) => (
        <mesh key={i}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color={`hsl(${i * 60}, 80%, 60%)`}
            transparent
            opacity={0.1 - i * 0.02}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
      ))}
      
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.3}
        color="#F59E0B"
        anchorX="center"
      >
        ∞ Harmonic Zero ∞
      </Text>
    </group>
  )
}

// Mathematical Grid showing omniversal structure
function OmniversalGrid() {
  const gridSize = 10
  const gridDivisions = 20
  
  return (
    <>
      {/* XY Plane */}
      <gridHelper
        args={[gridSize, gridDivisions, '#06B6D4', '#06B6D4']}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
      
      {/* XZ Plane */}
      <gridHelper
        args={[gridSize, gridDivisions, '#8B5CF6', '#8B5CF6']}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* YZ Plane */}
      <gridHelper
        args={[gridSize, gridDivisions, '#EC4899', '#EC4899']}
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </>
  )
}

export default function PhysicsCrystalStage({ onNext, onPrev }: PhysicsCrystalStageProps) {
  const [mode, setMode] = useState<'putty' | 'water' | 'crystal'>('water')
  const [showFilling, setShowFilling] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showZero, setShowZero] = useState(true)

  return (
    <div className="stage">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="stage-header"
      >
        <h1 className="stage-title">
          🌊 Physics: The Omniversal Fluid Crystal
        </h1>
        <p className="stage-description">
          Physics isn't rigid rules—it's a living, flowing crystal that fills every crack in reality!
        </p>
      </motion.div>

      {/* Interactive 3D Visualization */}
      <div style={{ height: '500px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', marginBottom: '2rem' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
          
          {showGrid && <OmniversalGrid />}
          {showZero && <HarmonicZero />}
          <FluidPhysicsCrystal mode={mode} />
          {showFilling && <FillingCracksVisualization active={showFilling} />}
          
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="control-panel" style={{ marginBottom: '2rem' }}>
        <div className="control-group">
          <div className="control-label">
            <span>🔬 Physics Behavior Mode</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => setMode('water')}
              style={{
                flex: 1,
                background: mode === 'water' ? 'linear-gradient(135deg, #06B6D4, #0891B2)' : 'rgba(6, 182, 212, 0.2)',
                border: '2px solid #06B6D4'
              }}
            >
              💧 Water Mode
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.3rem' }}>
                Flows to fill all spaces
              </div>
            </button>
            <button
              onClick={() => setMode('putty')}
              style={{
                flex: 1,
                background: mode === 'putty' ? 'linear-gradient(135deg, #EC4899, #DB2777)' : 'rgba(236, 72, 153, 0.2)',
                border: '2px solid #EC4899'
              }}
            >
              🎨 Putty Mode
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.3rem' }}>
                Deforms and adapts
              </div>
            </button>
            <button
              onClick={() => setMode('crystal')}
              style={{
                flex: 1,
                background: mode === 'crystal' ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'rgba(139, 92, 246, 0.2)',
                border: '2px solid #8B5CF6'
              }}
            >
              💎 Crystal Mode
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.3rem' }}>
                Structured perfection
              </div>
            </button>
          </div>
        </div>

        <div className="control-group">
          <div className="control-label">
            <span>👁️ Visualization Layers</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => setShowFilling(!showFilling)}
              style={{
                background: showFilling ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10B981'
              }}
            >
              {showFilling ? '✅' : '⬜'} Filling Cracks
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              style={{
                background: showGrid ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'rgba(59, 130, 246, 0.2)',
                border: '2px solid #3B82F6'
              }}
            >
              {showGrid ? '✅' : '⬜'} Mathematical Grid
            </button>
            <button
              onClick={() => setShowZero(!showZero)}
              style={{
                background: showZero ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(245, 158, 11, 0.2)',
                border: '2px solid #F59E0B'
              }}
            >
              {showZero ? '✅' : '⬜'} Harmonic Zero
            </button>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="info-box" style={{ marginBottom: '2rem' }}>
        <h3>⚡ Tesla's Discovery: Physics is Alive!</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
          My dear young scientists, physics is not a collection of dead equations in textbooks. 
          It is a <strong style={{ color: '#06B6D4' }}>living, breathing fluid crystal</strong> that 
          flows through every atom, every star, every thought in your mind!
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            border: '2px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#06B6D4', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
              💧 Like Water in Cracks
            </h4>
            <p style={{ lineHeight: '1.7' }}>
              Just as water flows into every crack and crevice, physics fills every possible space in the universe. 
              There is <strong>no void</strong>—only physics finding new ways to express itself!
            </p>
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              HHF-AI detects: <strong style={{ color: '#06B6D4' }}>Fluid dynamics in hydrogen networks</strong>
            </div>
          </div>

          <div style={{
            background: 'rgba(236, 72, 153, 0.1)',
            border: '2px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#EC4899', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
              🎨 Like Putty Adapting
            </h4>
            <p style={{ lineHeight: '1.7' }}>
              Physics is <strong>adaptive</strong>! It molds itself to fit whatever container reality provides. 
              In your brain: thoughts. In stars: fusion. In atoms: quantum fields. Same physics, infinite forms!
            </p>
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              HHF-AI detects: <strong style={{ color: '#EC4899' }}>Adaptive field topology</strong>
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#8B5CF6', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
              💎 Like Crystal Structure
            </h4>
            <p style={{ lineHeight: '1.7' }}>
              Yet physics maintains <strong>perfect mathematical order</strong>. Every atom knows the rules. 
              Every photon obeys the speed limit. This is the crystal structure beneath the fluid surface!
            </p>
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              HHF-AI detects: <strong style={{ color: '#8B5CF6' }}>Crystalline lattice symmetries</strong>
            </div>
          </div>
        </div>
      </div>

      {/* The Three Preservations */}
      <div className="info-box" style={{ 
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(236, 72, 153, 0.1))',
        border: '2px solid rgba(245, 158, 11, 0.4)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#F59E0B', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          ∞ The Three Sacred Preservations ∞
        </h3>
        
        <div style={{ 
          display: 'grid',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.5rem',
            borderRadius: '12px',
            borderLeft: '4px solid #06B6D4'
          }}>
            <h4 style={{ color: '#06B6D4', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
              1️⃣ Mathematical Zero: The Point of Perfect Balance
            </h4>
            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              At the center of the omniversal crystal is <strong style={{ color: '#F59E0B' }}>harmonic zero</strong>—
              the point where all forces balance, all waves cancel, all equations equal zero. 
              This is not "nothing"—it is <strong>EVERYTHING in perfect equilibrium</strong>!
            </p>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}>
              Σ Forces = 0 (yet all forces present)<br/>
              ∫ Fields dV = 0 (yet all fields active)<br/>
              Ψ Awareness = ∞ (maximum at zero point)
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.5rem',
            borderRadius: '12px',
            borderLeft: '4px solid #8B5CF6'
          }}>
            <h4 style={{ color: '#8B5CF6', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
              2️⃣ Elemental Harmony: Every Element in Concert
            </h4>
            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              The crystal contains <strong>every element</strong>—from hydrogen (the simplest) to uranium (the complex) 
              to elements not yet discovered! Each element is a <strong style={{ color: '#EC4899' }}>unique vibration</strong> of 
              the same underlying physics putty.
            </p>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'rgba(139, 92, 246, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}>
              H (hydrogen): frequency = 1.420 GHz (base note)<br/>
              C (carbon): frequency = 10.7 MHz (harmony 1)<br/>
              Fe (iron): frequency = 13.6 MHz (harmony 2)<br/>
              ...<br/>
              Unobtainium: frequency = ??? (yet to discover!)
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.5rem',
            borderRadius: '12px',
            borderLeft: '4px solid #EC4899'
          }}>
            <h4 style={{ color: '#EC4899', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
              3️⃣ Harmonic Motion: Everything Oscillates in Unity
            </h4>
            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              The crystal is not static—it <strong style={{ color: '#06B6D4' }}>vibrates eternally</strong>! 
              Every particle oscillates. Every field waves. Every thought resonates. All in 
              <strong style={{ color: '#F59E0B' }}> perfect harmonic relationship</strong> with each other.
            </p>
            <div style={{ 
              fontFamily: 'monospace', 
              background: 'rgba(236, 72, 153, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}>
              ω₁ : ω₂ : ω₃ : ... : ωₙ<br/>
              = 1 : φ : φ² : ... : φⁿ (golden ratio harmonics)<br/>
              <br/>
              All frequencies related by φ = 1.618... (nature's perfect ratio)
            </div>
          </div>
        </div>
      </div>

      {/* How HHF-AI MRI Images This */}
      <div className="info-box" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))',
        border: '2px solid rgba(6, 182, 212, 0.4)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#06B6D4', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          🔬 How HHF-AI MRI Images the Omniversal Crystal
        </h3>
        
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Traditional MRI sees only anatomy—bones, organs, tissues. But <strong style={{ color: '#8B5CF6' }}>HHF-AI MRI</strong> sees 
          the <strong>physics itself</strong>! It images how the omniversal crystal flows through your brain, 
          filling every synapse like water finding its level.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#EF4444', marginBottom: '0.8rem' }}>❌ Traditional MRI Sees:</h4>
            <ul style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
              <li>Gray matter vs white matter</li>
              <li>Blood flow in vessels</li>
              <li>Tumors and lesions</li>
              <li>Static anatomical structure</li>
            </ul>
            <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.8 }}>
              "What does the body look like?"
            </p>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#10B981', marginBottom: '0.8rem' }}>✅ HHF-AI MRI Sees:</h4>
            <ul style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
              <li>Physics flowing through hydrogen networks</li>
              <li>Zero points where forces balance</li>
              <li>Harmonic vibrations (1.420 GHz)</li>
              <li>Awareness as fluid crystal in motion</li>
            </ul>
            <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.8 }}>
              "What is physics doing in this moment?"
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', fontWeight: 500 }}>
            <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>💡</span>
            <strong style={{ color: '#F59E0B' }}>The Revolutionary Insight:</strong> Your thoughts are not separate from physics—
            they ARE physics! The omniversal crystal flows through your neurons, and HHF-AI MRI can see this flow 
            in real-time. <em style={{ color: '#8B5CF6' }}>You are physics experiencing itself.</em>
          </p>
        </div>
      </div>

      {/* Interactive Experiment */}
      <div className="info-box" style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
        border: '2px solid rgba(139, 92, 246, 0.4)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#8B5CF6', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          🧪 Try This Experiment at Home!
        </h3>
        
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '2rem',
          borderRadius: '12px'
        }}>
          <h4 style={{ color: '#EC4899', marginBottom: '1rem' }}>
            The Putty Experiment: Feel Physics with Your Hands
          </h4>
          
          <ol style={{ lineHeight: '2.2', fontSize: '1.05rem', paddingLeft: '2rem' }}>
            <li>Get some <strong style={{ color: '#06B6D4' }}>silly putty or play-doh</strong></li>
            <li>Press it into a bowl or container with <strong style={{ color: '#8B5CF6' }}>cracks and crevices</strong></li>
            <li>Watch how the putty <strong style={{ color: '#EC4899' }}>flows to fill every space</strong>—
                it finds all the cracks, leaves no void!</li>
            <li>Now pull it out slowly—see how it <strong style={{ color: '#F59E0B' }}>stretches and adapts</strong>, 
                maintaining connection even as it changes shape?</li>
          </ol>

          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '8px',
            borderLeft: '4px solid #06B6D4'
          }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <strong style={{ color: '#06B6D4' }}>🎯 What You're Feeling:</strong> This is EXACTLY how physics behaves! 
              It flows into every space (even the "empty" vacuum of space is filled with quantum fields). 
              It adapts to every situation (same laws, infinite expressions). 
              It never breaks connection (all particles are connected through fields).
            </p>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '1.5rem',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            borderLeft: '4px solid #F59E0B'
          }}>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', fontStyle: 'italic' }}>
              <strong style={{ color: '#F59E0B' }}>⚡ Tesla's Note:</strong> "When you play with putty, 
              you are literally playing with a miniature model of the universe. The putty molecules 
              flow according to the same physics that makes galaxies spiral and neurons fire. 
              <em style={{ color: '#EC4899' }}>You are touching the omniversal crystal!</em>"
            </p>
          </div>
        </div>
      </div>

      {/* Key Takeaways for Kids */}
      <div className="info-box" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(236, 72, 153, 0.15))',
        border: '3px solid rgba(245, 158, 11, 0.5)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#F59E0B', fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          🌟 Remember These Amazing Facts! 🌟
        </h3>
        
        <div style={{
          display: 'grid',
          gap: '1rem',
          fontSize: '1.1rem'
        }}>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(6, 182, 212, 0.2)', 
            borderRadius: '8px',
            borderLeft: '4px solid #06B6D4'
          }}>
            💧 <strong>Physics is like water</strong> - it fills every crack, every space, everywhere!
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(236, 72, 153, 0.2)', 
            borderRadius: '8px',
            borderLeft: '4px solid #EC4899'
          }}>
            🎨 <strong>Physics is like putty</strong> - it adapts and molds to fit any situation!
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(139, 92, 246, 0.2)', 
            borderRadius: '8px',
            borderLeft: '4px solid #8B5CF6'
          }}>
            💎 <strong>Physics is like crystal</strong> - it has perfect mathematical structure underneath!
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(245, 158, 11, 0.2)', 
            borderRadius: '8px',
            borderLeft: '4px solid #F59E0B'
          }}>
            ∞ <strong>There is a harmonic zero</strong> - a perfect balance point at the center of everything!
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(16, 185, 129, 0.2)', 
            borderRadius: '8px',
            borderLeft: '4px solid #10B981'
          }}>
            🧠 <strong>Your thoughts are physics too</strong> - HHF-AI MRI can see them flowing!
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Previous
        </button>
        <button className="nav-button primary" onClick={onNext}>
          Continue Journey →
        </button>
      </div>
    </div>
  )
}

