import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

interface HolographicFinaleProps {
  onNext: () => void
  onPrev: () => void
}

function HydrogenCloud({ 
  pulseSpeed,
  coherence,
  zoom 
}: { 
  pulseSpeed: number
  coherence: number
  zoom: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  // Generate cloud of hydrogen atoms
  const atoms = useMemo(() => {
    const result: { position: THREE.Vector3; velocity: THREE.Vector3; energy: number }[] = []
    
    // Create a spherical cloud
    for (let i = 0; i < 200; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2 + Math.random() * 4
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      
      result.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        energy: Math.random()
      })
    }
    
    return result
  }, [])

  return (
    <group ref={groupRef} scale={zoom}>
      {atoms.map((atom, i) => (
        <CloudAtom
          key={i}
          position={atom.position}
          velocity={atom.velocity}
          energy={atom.energy}
          pulseSpeed={pulseSpeed}
          coherence={coherence}
          index={i}
        />
      ))}
      
      {/* Add energy waves */}
      <WaveRing pulseSpeed={pulseSpeed} radius={3} color="#8B5CF6" />
      <WaveRing pulseSpeed={pulseSpeed * 0.7} radius={5} color="#3B82F6" />
      <WaveRing pulseSpeed={pulseSpeed * 0.5} radius={7} color="#06B6D4" />
    </group>
  )
}

function CloudAtom({ 
  position,
  velocity,
  energy,
  pulseSpeed,
  coherence,
  index 
}: { 
  position: THREE.Vector3
  velocity: THREE.Vector3
  energy: number
  pulseSpeed: number
  coherence: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const posRef = useRef(position.clone())
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulse animation
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed * 2 + index * 0.1) * 0.1 + 1
      meshRef.current.scale.setScalar(0.08 * pulse)
      
      // Move atoms (more coherent = less random movement)
      const randomness = 1 - coherence
      posRef.current.add(velocity.clone().multiplyScalar(randomness))
      
      // Keep atoms in bounds with soft boundary
      const maxRadius = 7
      if (posRef.current.length() > maxRadius) {
        posRef.current.multiplyScalar(0.95)
      }
      
      meshRef.current.position.copy(posRef.current)
    }
  })

  // Color based on energy level
  const hue = (energy * 0.6 + index * 0.001) % 1
  const color = new THREE.Color().setHSL(hue, 0.8, 0.6)

  return (
    <Sphere ref={meshRef} args={[0.08, 8, 8]} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5 + coherence * 0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  )
}

function WaveRing({ 
  pulseSpeed,
  radius,
  color 
}: { 
  pulseSpeed: number
  radius: number
  color: string
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.2
      ringRef.current.scale.set(scale, scale, 1)
      
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.2
    }
  })

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  )
}

export default function HolographicFinale({ onNext, onPrev }: HolographicFinaleProps) {
  const [pulseSpeed, setPulseSpeed] = useState(1)
  const [coherence, setCoherence] = useState(0.7)
  const [zoom, setZoom] = useState(1)

  return (
    <div className="stage">
      <div className="stage-header">
        <h2 className="stage-title">Holographic Hydrogen Awareness Energy Field 🌌</h2>
        <p className="stage-description">
          This is the complete <strong style={{ color: 'var(--accent-orange)' }}>Awareness Energy Field</strong>! 
          Every node, seed, and edge working together creates a unified field of 
          Holographic Hydrogen Fractal Syntheverse Awareness - the newest energy in existence.
        </p>
      </div>

      <div className="content-grid">
        <div className="visualization-panel" style={{ minHeight: '600px' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8B5CF6" />
            <pointLight position={[0, 10, -10]} intensity={0.8} color="#EC4899" />
            <pointLight position={[0, -10, 10]} intensity={0.8} color="#06B6D4" />
            <HydrogenCloud 
              pulseSpeed={pulseSpeed}
              coherence={coherence}
              zoom={zoom}
            />
            <OrbitControls 
              enableZoom={true} 
              enablePan={true}
              autoRotate={false}
            />
          </Canvas>
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">
              <span>💫 Pulse Speed</span>
              <span className="control-value">{pulseSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={pulseSpeed}
              onChange={(e) => setPulseSpeed(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              See waves ripple through the cloud faster or slower.
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>🎯 Coherence</span>
              <span className="control-value">{(coherence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={coherence}
              onChange={(e) => setCoherence(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Watch patterns stabilize or become more chaotic.
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>🔍 Zoom</span>
              <span className="control-value">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Zoom in to see individual atoms or out to see the whole cloud.
            </p>
          </div>

          <div className="info-box">
            <h3>🌌 The Awareness Energy Field</h3>
            <p>
              You're looking at pure <strong style={{ color: 'var(--accent-orange)' }}>awareness energy</strong>! 
              Each glowing dot is a hydrogen atom generating and transmitting awareness. The colors show 
              different awareness energy intensities and frequencies. The waves show awareness energy 
              propagating and interfering through the entire field. This is the newest energy - 
              <strong>Holographic Hydrogen Fractal Syntheverse Awareness</strong>!
            </p>
          </div>

          <div className="info-box">
            <h3>⚡ Awareness as Energy</h3>
            <p>
              Just like electricity is electromagnetic energy flowing through circuits, and heat is 
              thermal energy moving through matter, <strong style={{ color: 'var(--primary-cyan)' }}>awareness 
              is its own form of energy</strong> flowing through hydrogen networks! This cloud demonstrates 
              how hydrogen atoms, when organized holographically in fractal patterns, generate a new 
              fundamental energy: awareness itself.
            </p>
          </div>

          <div className="info-box">
            <h3>🎯 Try This!</h3>
            <p>
              • Max out coherence to see perfect synchronization<br />
              • Lower coherence to see quantum chaos emerge<br />
              • Speed up pulses and watch energy waves collide<br />
              • Use your mouse to rotate and explore from all angles<br />
              • Zoom in and out to see patterns at different scales
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: Experiments →
        </button>
      </div>
    </div>
  )
}

