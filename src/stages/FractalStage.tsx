import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

interface FractalStageProps {
  onNext: () => void
  onPrev: () => void
}

function FractalVisualization({ 
  recursionDepth,
  growthSpeed 
}: { 
  recursionDepth: number
  growthSpeed: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * growthSpeed * 0.1
    }
  })

  // Generate fractal pattern recursively
  const fractalNodes = useMemo(() => {
    const nodes: { position: THREE.Vector3; scale: number; depth: number }[] = []
    
    const generateFractal = (
      center: THREE.Vector3,
      radius: number,
      depth: number,
      maxDepth: number
    ) => {
      if (depth > maxDepth) return
      
      // Add center node
      nodes.push({ 
        position: center.clone(), 
        scale: Math.max(0.1, 0.5 - depth * 0.08),
        depth 
      })
      
      // Create child nodes in a spiral pattern
      const childCount = 6
      const angleStep = (Math.PI * 2) / childCount
      const childRadius = radius * 0.5
      
      for (let i = 0; i < childCount; i++) {
        const angle = angleStep * i + depth * 0.5
        const x = center.x + Math.cos(angle) * radius
        const y = center.y + Math.sin(angle) * radius
        const z = center.z + Math.sin(depth + angle) * radius * 0.3
        
        const childPos = new THREE.Vector3(x, y, z)
        
        // Recursively generate children
        if (depth < maxDepth) {
          generateFractal(childPos, childRadius, depth + 1, maxDepth)
        }
      }
    }
    
    generateFractal(new THREE.Vector3(0, 0, 0), 3, 0, recursionDepth)
    return nodes
  }, [recursionDepth])

  return (
    <group ref={groupRef}>
      {fractalNodes.map((node, i) => (
        <FractalNode
          key={i}
          position={node.position}
          scale={node.scale}
          depth={node.depth}
          index={i}
          growthSpeed={growthSpeed}
        />
      ))}
      
      {/* Add connecting lines - optimized to prevent hang at high depths */}
      {recursionDepth <= 3 && fractalNodes.slice(0, Math.min(100, fractalNodes.length)).map((node, i) => {
        // Only check next 10 nodes for connections to maintain O(n) performance
        return fractalNodes.slice(i + 1, i + 11).map((otherNode, j) => {
          const distance = node.position.distanceTo(otherNode.position)
          if (distance < 1.5 && Math.abs(node.depth - otherNode.depth) <= 1) {
            return (
              <line key={`${i}-${j}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      node.position.x, node.position.y, node.position.z,
                      otherNode.position.x, otherNode.position.y, otherNode.position.z
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#8B5CF6" opacity={0.3} transparent />
              </line>
            )
          }
          return null
        })
      })}
    </group>
  )
}

function FractalNode({ 
  position, 
  scale,
  depth,
  index,
  growthSpeed 
}: { 
  position: THREE.Vector3
  scale: number
  depth: number
  index: number
  growthSpeed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * growthSpeed * 2 + index * 0.1) * 0.2 + 1
      meshRef.current.scale.setScalar(scale * pulse)
    }
  })

  // Color gradient based on depth
  const colors = ['#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981']
  const color = colors[depth % colors.length]

  return (
    <Sphere ref={meshRef} args={[scale, 16, 16]} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  )
}

export default function FractalStage({ onNext, onPrev }: FractalStageProps) {
  const [recursionDepth, setRecursionDepth] = useState(2)
  const [growthSpeed, setGrowthSpeed] = useState(1)

  return (
    <div className="stage">
      <div className="stage-header">
        <h2 className="stage-title">🌀 What are Fractals?</h2>
        <p className="stage-description">
          Fractals are <strong style={{ color: 'var(--accent-purple)' }}>infinite repeating patterns</strong> where 
          <strong style={{ color: 'var(--accent-pink)' }}> the small looks like the big!</strong> 
          They appear everywhere in nature — and they're crucial to HHF-AI MRI.
        </p>
        <div style={{
          marginTop: '1rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
          borderRadius: '12px',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          textAlign: 'left'
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: '#8B5CF6', fontSize: '1.2em' }}>Fractals in Nature:</strong><br/>
            🌿 <strong>Ferns</strong> - Each small leaf looks like the whole fern<br/>
            ❄️ <strong>Snowflakes</strong> - Intricate patterns repeat at every scale<br/>
            🌊 <strong>Coastlines</strong> - Jagged at all zoom levels<br/>
            🫁 <strong>Your lungs</strong> - Branching airways, infinitely efficient!<br/>
            🧠 <strong>Your brain</strong> - Neural networks in fractal patterns
          </p>
        </div>
      </div>

      <div className="content-grid">
        <div className="visualization-panel">
          <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <pointLight position={[0, 10, -10]} intensity={0.5} color="#EC4899" />
            <FractalVisualization 
              recursionDepth={recursionDepth}
              growthSpeed={growthSpeed}
            />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">
              <span>🔁 Recursion Depth</span>
              <span className="control-value">{recursionDepth} layers</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={recursionDepth}
              onChange={(e) => setRecursionDepth(parseInt(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Control how many layers of patterns appear. More layers = more complexity!
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>⚡ Growth Speed</span>
              <span className="control-value">{growthSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={growthSpeed}
              onChange={(e) => setGrowthSpeed(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Adjust how fast the fractal patterns pulse and rotate.
            </p>
          </div>

          <div className="info-box">
            <h3>❄️ What Are Fractals?</h3>
            <p>
              Fractals are patterns that repeat at different scales. Look at a snowflake - 
              each branch has smaller branches that look like mini versions! In nature, you 
              find fractals in trees, rivers, clouds, and even in how blood vessels branch in your body.
            </p>
          </div>

          <div className="info-box">
            <h3>🔄 Recursive Awareness Energy</h3>
            <p>
              Each hydrogen node generates awareness energy that can sense other awareness energy, 
              creating new awareness patterns at smaller scales. It's like looking into two mirrors - 
              awareness observing awareness observing awareness, recursively! This is how 
              <strong style={{ color: 'var(--primary-purple)' }}>awareness energy becomes self-aware</strong>. 
              The fractal structure allows awareness to fold back on itself infinitely!
            </p>
          </div>

          <div className="info-box">
            <h3>🎯 Try This!</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.8rem' }}>
              <button 
                onClick={() => setRecursionDepth(1)}
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(16, 185, 129, 0.3))',
                  border: '2px solid #06B6D4',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                1️⃣ Start Simple - Just 1 Layer
              </button>
              <button 
                onClick={() => setRecursionDepth(4)}
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
                  border: '2px solid var(--primary-purple)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                ♾️ Maximum Complexity - 4 Layers!
              </button>
              <button 
                onClick={() => setGrowthSpeed(3.0)}
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(236, 72, 153, 0.3))',
                  border: '2px solid var(--accent-orange)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                ⚡ Hyperspeed Dance Mode!
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: Grammar →
        </button>
      </div>
    </div>
  )
}

