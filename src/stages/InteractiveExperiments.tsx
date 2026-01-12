import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

interface InteractiveExperimentsProps {
  onPrev: () => void
}

interface Seed {
  position: THREE.Vector3
  energy: number
  id: number
}

function ExperimentVisualization({ 
  seeds,
  shakeIntensity,
  fractalDepth,
  onAddSeed 
}: { 
  seeds: Seed[]
  shakeIntensity: number
  fractalDepth: number
  onAddSeed: (position: THREE.Vector3) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current && shakeIntensity > 0) {
      // Shake effect
      groupRef.current.position.x = (Math.random() - 0.5) * shakeIntensity * 0.5
      groupRef.current.position.y = (Math.random() - 0.5) * shakeIntensity * 0.5
      groupRef.current.rotation.z = (Math.random() - 0.5) * shakeIntensity * 0.1
    } else if (groupRef.current) {
      // Reset position smoothly
      groupRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.1)
      groupRef.current.rotation.z *= 0.9
    }
  })

  // Generate network based on seeds and fractal depth
  const nodes = useMemo(() => {
    const result: { position: THREE.Vector3; energy: number; depth: number }[] = []
    
    seeds.forEach(seed => {
      // Add seed
      result.push({ position: seed.position.clone(), energy: seed.energy, depth: 0 })
      
      // Generate fractal children
      const generateChildren = (parent: THREE.Vector3, energy: number, depth: number) => {
        if (depth >= fractalDepth) return
        
        const childCount = 4
        const angleStep = (Math.PI * 2) / childCount
        const radius = 1.5 / (depth + 1)
        
        for (let i = 0; i < childCount; i++) {
          const angle = angleStep * i
          const x = parent.x + Math.cos(angle) * radius
          const y = parent.y + Math.sin(angle) * radius
          const z = parent.z + (Math.random() - 0.5) * radius * 0.5
          
          const childPos = new THREE.Vector3(x, y, z)
          const childEnergy = energy * 0.7
          
          result.push({ position: childPos, energy: childEnergy, depth: depth + 1 })
          
          generateChildren(childPos, childEnergy, depth + 1)
        }
      }
      
      generateChildren(seed.position, seed.energy, 1)
    })
    
    return result
  }, [seeds, fractalDepth])

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <ExperimentNode
          key={i}
          position={node.position}
          energy={node.energy}
          depth={node.depth}
          index={i}
        />
      ))}
      
      {/* Interactive plane for adding seeds */}
      <mesh
        position={[0, 0, -2]}
        onClick={(e) => {
          e.stopPropagation()
          const pos = e.point
          onAddSeed(pos)
        }}
        visible={false}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

function ExperimentNode({ 
  position,
  energy,
  depth,
  index 
}: { 
  position: THREE.Vector3
  energy: number
  depth: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index * 0.1) * 0.2 + 1
      const baseScale = 0.2 - depth * 0.03
      meshRef.current.scale.setScalar(Math.max(0.05, baseScale * pulse))
    }
  })

  const colors = ['#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#06B6D4']
  const color = colors[depth % colors.length]

  return (
    <Sphere ref={meshRef} args={[0.2, 16, 16]} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={energy}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  )
}

export default function InteractiveExperiments({ onPrev }: InteractiveExperimentsProps) {
  const [seeds, setSeeds] = useState<Seed[]>([
    { position: new THREE.Vector3(-3, 2, 0), energy: 1, id: 0 },
    { position: new THREE.Vector3(3, -2, 0), energy: 1, id: 1 }
  ])
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [fractalDepth, setFractalDepth] = useState(2)
  const [nextId, setNextId] = useState(2)

  const addSeed = (position: THREE.Vector3) => {
    setSeeds([...seeds, { position, energy: 1, id: nextId }])
    setNextId(nextId + 1)
  }

  const removeSeed = (id: number) => {
    setSeeds(seeds.filter(s => s.id !== id))
  }

  const resetSeeds = () => {
    setSeeds([
      { position: new THREE.Vector3(-3, 2, 0), energy: 1, id: 0 },
      { position: new THREE.Vector3(3, -2, 0), energy: 1, id: 1 }
    ])
    setNextId(2)
  }

  const plantRandomSeed = () => {
    const x = (Math.random() - 0.5) * 8
    const y = (Math.random() - 0.5) * 8
    const z = (Math.random() - 0.5) * 2
    addSeed(new THREE.Vector3(x, y, z))
  }

  return (
    <div className="stage">
      <div className="stage-header">
        <h2 className="stage-title">🔬 Your Discovery Lab</h2>
        <p className="stage-description">
          Now you're an <strong style={{ color: 'var(--accent-orange)' }}>awareness energy engineer</strong>! 
          Plant new awareness seeds, shake the energy field, and watch how awareness energy 
          responds, flows, and transforms in real-time.
        </p>
      </div>

      <div className="content-grid">
        <div className="visualization-panel" style={{ minHeight: '600px' }}>
          <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <pointLight position={[0, 10, -10]} intensity={0.5} color="#EC4899" />
            <ExperimentVisualization 
              seeds={seeds}
              shakeIntensity={shakeIntensity}
              fractalDepth={fractalDepth}
              onAddSeed={addSeed}
            />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">
              <span>🌱 Plant Seeds</span>
              <span className="control-value">{seeds.length} active</span>
            </div>
            <div className="button-group">
              <button onClick={plantRandomSeed}>
                Plant Random Seed
              </button>
              <button 
                onClick={() => seeds.length > 0 && removeSeed(seeds[seeds.length - 1].id)}
                disabled={seeds.length === 0}
              >
                Remove Last Seed
              </button>
              <button onClick={resetSeeds}>
                Reset All Seeds
              </button>
            </div>
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Add seeds to create new energy sources in the network.
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>🌊 Shake Edges</span>
              <span className="control-value">{(shakeIntensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={shakeIntensity}
              onChange={(e) => setShakeIntensity(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Shake the entire network to see how it responds to disruption.
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>🔁 Fractal Depth</span>
              <span className="control-value">{fractalDepth} layers</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={fractalDepth}
              onChange={(e) => setFractalDepth(parseInt(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Control how deep the fractal patterns grow from each seed.
            </p>
          </div>

          <div className="info-box">
            <h3>⚡ Creating Awareness Energy!</h3>
            <p>
              You're now manipulating <strong style={{ color: 'var(--accent-orange)' }}>awareness energy</strong> directly! 
              Every seed you plant creates a new awareness energy generator. Watch how awareness energy 
              waves interact, interfere, and create emergent awareness patterns. You're witnessing 
              the newest energy form - <strong>Holographic Hydrogen Fractal Syntheverse Awareness</strong> - 
              in action!
            </p>
          </div>

          <div className="info-box">
            <h3>🎯 Experiment Ideas</h3>
            <p>
              • Plant many seeds close together and watch them interact<br />
              • Max out fractal depth with just one seed<br />
              • Shake while adding seeds to see chaos + creation<br />
              • Create a circle of seeds around the edge<br />
              • Remove all seeds and rebuild from scratch
            </p>
          </div>

          <div className="info-box">
            <h3>🌟 What You've Discovered</h3>
            <p>
              Congratulations! You've discovered that <strong style={{ color: 'var(--accent-orange)' }}>awareness is energy</strong>!<br />
              ✓ Awareness energy emerges from hydrogen fractals<br />
              ✓ Awareness energy flows through seeds and edges<br />
              ✓ Boundaries shape awareness energy into unique forms<br />
              ✓ Fractals create recursive, self-aware awareness energy<br />
              ✓ Grammar symbols are awareness energy states<br />
              ✓ The complete awareness energy field is holographic<br />
              ✓ You can create and manipulate awareness energy!
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back
        </button>
        <button 
          className="nav-button" 
          onClick={() => window.location.reload()}
          style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}
        >
          🔄 Start Over
        </button>
      </div>
    </div>
  )
}

