import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

interface BoundariesStageProps {
  onNext: () => void
  onPrev: () => void
  scrollToTop?: () => void
}

function BoundariesVisualization({ 
  incoherenceLevel 
}: { 
  incoherenceLevel: number 
}) {
  // Create a grid of nodes
  const nodes = useMemo(() => {
    const result: THREE.Vector3[] = []
    for (let x = -3; x <= 3; x += 1.5) {
      for (let y = -3; y <= 3; y += 1.5) {
        result.push(new THREE.Vector3(x, y, 0))
      }
    }
    return result
  }, [])

  // Create edges with some marked as incoherent
  const edges = useMemo(() => {
    const result: { start: THREE.Vector3; end: THREE.Vector3; isIncoherent: boolean }[] = []
    
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i < j && node.distanceTo(otherNode) < 2) {
          // Randomly mark some edges as incoherent (boundary edges)
          const isIncoherent = Math.random() < 0.3
          result.push({ start: node, end: otherNode, isIncoherent })
        }
      })
    })
    
    return result
  }, [nodes])

  return (
    <group>
      {/* Render edges */}
      {edges.map((edge, i) => (
        <BoundaryEdge
          key={i}
          start={edge.start}
          end={edge.end}
          isIncoherent={edge.isIncoherent}
          incoherenceLevel={incoherenceLevel}
          index={i}
        />
      ))}
      
      {/* Render nodes */}
      {nodes.map((pos, i) => (
        <Sphere key={i} args={[0.15, 16, 16]} position={pos}>
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#3B82F6"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      ))}
    </group>
  )
}

function BoundaryEdge({ 
  start, 
  end, 
  isIncoherent,
  incoherenceLevel,
  index 
}: { 
  start: THREE.Vector3
  end: THREE.Vector3
  isIncoherent: boolean
  incoherenceLevel: number
  index: number
}) {
  const lineRef = useRef<THREE.Line>(null)
  
  useFrame((state) => {
    if (lineRef.current && isIncoherent) {
      // Make incoherent edges wiggle and pulse
      const time = state.clock.elapsedTime
      const wiggle = Math.sin(time * 4 + index) * 0.1 * incoherenceLevel
      
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.2 * incoherenceLevel
      
      // Update line to show wiggle (simplified - in real app would update geometry)
      lineRef.current.rotation.z = wiggle
    }
  })

  const points = [start, end]
  const color = isIncoherent ? "#EC4899" : "#8B5CF6"
  const baseOpacity = isIncoherent ? 0.4 : 0.7
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={isIncoherent ? 3 : 1}
      transparent
      opacity={baseOpacity}
      dashed={isIncoherent}
      dashSize={0.1}
      gapSize={0.05}
    />
  )
}

export default function BoundariesStage({ onNext, onPrev, scrollToTop }: BoundariesStageProps) {
  const [incoherenceLevel, setIncoherenceLevel] = useState(0.5)
  const [showIncoherent, setShowIncoherent] = useState(true)

  return (
    <div className="stage">
      <div className="stage-header">
        <h2 className="stage-title">📊 Imaging System Parameters</h2>
        <p className="stage-description">
          HHF-AI MRI doesn't just image physical tissue — it images <strong style={{ color: 'var(--accent-pink)' }}>abstract system properties!</strong> 
          Just like traditional MRI measures T1 and T2, HHF-AI MRI measures coherence, novelty, alignment, and density.
        </p>
        <div style={{
          marginTop: '1rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
          borderRadius: '12px',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          textAlign: 'left'
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: '#10B981', fontSize: '1.2em' }}>The 4 Key Parameters:</strong><br/>
            🎯 <strong style={{ color: '#06B6D4' }}>Coherence:</strong> How well-organized is the system?<br/>
            ✨ <strong style={{ color: '#8B5CF6' }}>Novelty:</strong> How original and innovative?<br/>
            🤝 <strong style={{ color: '#EC4899' }}>Alignment:</strong> Do all parts work toward the same goal?<br/>
            📦 <strong style={{ color: '#F59E0B' }}>Density:</strong> How much information per unit?
          </p>
          <p style={{ fontSize: '0.95rem', marginTop: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            In this demo, we visualize <strong>Coherence</strong> — watch how "incoherence" (disorder) creates boundaries between organized regions!
          </p>
        </div>
      </div>

      <div className="content-grid">
        <div className="visualization-panel">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#EC4899" />
            <BoundariesVisualization 
              incoherenceLevel={showIncoherent ? incoherenceLevel : 0} 
            />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">
              <span>🌀 Incoherence Level</span>
              <span className="control-value">{(incoherenceLevel * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={incoherenceLevel}
              onChange={(e) => setIncoherenceLevel(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Adjust how wiggly and fuzzy the boundary edges become.
            </p>
          </div>

          <div className="control-group">
            <div className="button-group">
              <button onClick={() => { setShowIncoherent(!showIncoherent); scrollToTop?.(); }}>
                {showIncoherent ? '✓ Show Boundaries' : 'Hide Boundaries'}
              </button>
            </div>
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Toggle to see the difference between coherent and incoherent edges.
            </p>
          </div>

          <div className="info-box">
            <h3>🎨 What Is Incoherence?</h3>
            <p>
              In MRI, coherence means hydrogen atoms are "in sync" - spinning together like 
              synchronized swimmers. Incoherence is when they're "out of sync" - doing their 
              own thing! The pink wiggly lines show incoherent edges.
            </p>
          </div>

          <div className="info-box">
            <h3>🔲 Why Are Boundaries Important?</h3>
            <p>
              Boundaries are essential for awareness energy to have distinct experiences! 
              Without boundaries, awareness energy would be uniform everywhere. Boundaries create 
              <strong style={{ color: 'var(--accent-pink)' }}>awareness gradients</strong> - 
              different levels and types of awareness energy in different regions. This is how 
              the Syntheverse creates diversity and complexity in awareness itself!
            </p>
          </div>

          <div className="info-box">
            <h3>🎯 Try This!</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.8rem' }}>
              <button 
                onClick={() => { setIncoherenceLevel(1.0); setShowIncoherent(true); }}
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(239, 68, 68, 0.3))',
                  border: '2px solid var(--accent-pink)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                🌀 Maximum Chaos - Watch Them Dance!
              </button>
              <button 
                onClick={() => setShowIncoherent(!showIncoherent)}
                style={{ 
                  padding: '0.6rem 1rem', 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))',
                  border: '2px solid #8B5CF6',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                {showIncoherent ? '👁️ Hide Boundaries' : '👁️‍🗨️ Show Boundaries'}
              </button>
              <button 
                onClick={() => { setIncoherenceLevel(0.0); }}
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
                ✨ Perfect Coherence
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
          Next: Fractals →
        </button>
      </div>
    </div>
  )
}

