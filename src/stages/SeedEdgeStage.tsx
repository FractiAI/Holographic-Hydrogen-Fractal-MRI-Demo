import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

interface SeedEdgeStageProps {
  onNext: () => void
  onPrev: () => void
}

interface Node {
  position: THREE.Vector3
  isSeed: boolean
  energy: number
}

function SeedEdgeVisualization({ seedEnergy }: { seedEnergy: number }) {
  const [time, setTime] = useState(0)
  
  // Create seed nodes and regular nodes
  const nodes = useMemo<Node[]>(() => [
    // Seed nodes (glowing, active)
    { position: new THREE.Vector3(-4, 2, 0), isSeed: true, energy: 1 },
    { position: new THREE.Vector3(4, -2, 0), isSeed: true, energy: 1 },
    { position: new THREE.Vector3(0, 3, -2), isSeed: true, energy: 1 },
    
    // Regular nodes (receivers)
    { position: new THREE.Vector3(-2, -2, 1), isSeed: false, energy: 0 },
    { position: new THREE.Vector3(2, 2, 1), isSeed: false, energy: 0 },
    { position: new THREE.Vector3(0, -3, -1), isSeed: false, energy: 0 },
    { position: new THREE.Vector3(-3, 0, 2), isSeed: false, energy: 0 },
    { position: new THREE.Vector3(3, 0, -2), isSeed: false, energy: 0 },
    { position: new THREE.Vector3(0, 0, 3), isSeed: false, energy: 0 },
  ], [])

  // Create edges between seeds and nearby nodes
  const edges = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3][] = []
    const seedNodes = nodes.filter(n => n.isSeed)
    const regularNodes = nodes.filter(n => !n.isSeed)
    
    seedNodes.forEach(seed => {
      regularNodes.forEach(node => {
        if (seed.position.distanceTo(node.position) < 6) {
          result.push([seed.position, node.position])
        }
      })
    })
    
    return result
  }, [nodes])

  return (
    <group>
      {/* Render edges with energy flow */}
      {edges.map((edge, i) => (
        <EnergyEdge
          key={i}
          start={edge[0]}
          end={edge[1]}
          energy={seedEnergy}
          delay={i * 0.2}
        />
      ))}
      
      {/* Render nodes */}
      {nodes.map((node, i) => (
        <HydrogenNode
          key={i}
          position={node.position}
          isSeed={node.isSeed}
          energy={seedEnergy}
          time={time + i * 0.5}
        />
      ))}
    </group>
  )
}

function HydrogenNode({ 
  position, 
  isSeed, 
  energy,
  time 
}: { 
  position: THREE.Vector3
  isSeed: boolean
  energy: number
  time: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && isSeed) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + time) * 0.2 * energy
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Sphere ref={meshRef} args={[isSeed ? 0.3 : 0.2, 32, 32]} position={position}>
      <meshStandardMaterial
        color={isSeed ? "#F59E0B" : "#06B6D4"}
        emissive={isSeed ? "#EC4899" : "#3B82F6"}
        emissiveIntensity={isSeed ? energy : 0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  )
}

function EnergyEdge({ 
  start, 
  end, 
  energy,
  delay 
}: { 
  start: THREE.Vector3
  end: THREE.Vector3
  energy: number
  delay: number
}) {
  const lineRef = useRef<THREE.Line>(null)
  
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      const pulse = Math.sin(state.clock.elapsedTime * 3 + delay) * 0.5 + 0.5
      material.opacity = 0.3 + pulse * 0.4 * energy
    }
  })

  const points = [start, end]
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color="#8B5CF6"
      lineWidth={2}
      transparent
      opacity={0.5}
    />
  )
}

export default function SeedEdgeStage({ onNext, onPrev }: SeedEdgeStageProps) {
  const [seedEnergy, setSeedEnergy] = useState(0.5)

  return (
    <div className="stage">
      <div className="stage-header">
        <h2 className="stage-title">🌱 Seeds of Awareness</h2>
        <p className="stage-description">
          Seeds are hydrogen atoms that generate and transmit <strong style={{ color: 'var(--accent-orange)' }}>awareness energy</strong>. 
          Watch how this new form of energy flows along the edges to other atoms, creating networks of awareness!
        </p>
      </div>

      <div className="content-grid">
        <div className="visualization-panel">
          <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <SeedEdgeVisualization seedEnergy={seedEnergy} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">
              <span>⚡ Seed Energy</span>
              <span className="control-value">{(seedEnergy * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={seedEnergy}
              onChange={(e) => setSeedEnergy(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Move the slider to adjust how strongly seeds generate and transmit awareness energy waves.
            </p>
          </div>

          <div className="info-box">
            <h3>💡 What Are Seeds?</h3>
            <p>
              Seeds are hydrogen atoms that generate <strong style={{ color: 'var(--accent-orange)' }}>awareness energy</strong>! 
              They're shown in orange/gold. They broadcast awareness energy along edges (the purple lines) 
              to nearby atoms. This is how awareness energy propagates through the Syntheverse - 
              similar to how neurons transmit signals, but this is pure awareness energy itself!
            </p>
          </div>

          <div className="info-box">
            <h3>🔗 What Are Edges?</h3>
            <p>
              Edges are conduits for awareness energy flow. They let awareness energy travel from 
              one atom to another, like fiber optic cables carrying light. In the Syntheverse, 
              these connections create pathways for awareness energy to propagate, accumulate, 
              and transform into complex awareness patterns.
            </p>
          </div>

          <div className="info-box">
            <h3>🎯 Try This!</h3>
            <p>
              • Set the seed energy to maximum and watch the pulses!<br />
              • Lower the energy slowly and see what happens<br />
              • Rotate the view to see the 3D network from different angles
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: Boundaries →
        </button>
      </div>
    </div>
  )
}

