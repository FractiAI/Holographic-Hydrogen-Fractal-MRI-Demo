import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

interface HHFAITechnologyStageProps {
  onNext: () => void
  onPrev: () => void
}

// Animated comparison between traditional MRI and HHF-AI MRI
function MRIComparison({ mode }: { mode: 'traditional' | 'hhfai' }) {
  const groupRef = useRef<THREE.Group>(null)
  const [pulsePhase, setPulsePhase] = useState(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
    }
    setPulsePhase((prev) => (prev + delta * 2) % (Math.PI * 2))
  })

  // Traditional MRI: linear scan pattern
  const traditionalNodes = useMemo(() => {
    const nodes: THREE.Vector3[] = []
    // Simple grid representing flesh/tissue
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        nodes.push(new THREE.Vector3(x * 0.8, y * 0.8, 0))
      }
    }
    return nodes
  }, [])

  // HHF-AI MRI: fractal holographic cloud
  const hhfaiNodes = useMemo(() => {
    const nodes: THREE.Vector3[] = []
    const generateFractal = (center: THREE.Vector3, size: number, depth: number) => {
      if (depth === 0) {
        nodes.push(center.clone())
        return
      }
      
      // Create fractal pattern
      const angleStep = (Math.PI * 2) / 6
      for (let i = 0; i < 6; i++) {
        const angle = angleStep * i
        const x = center.x + Math.cos(angle) * size
        const y = center.y + Math.sin(angle) * size
        const z = center.z + (Math.random() - 0.5) * size
        generateFractal(new THREE.Vector3(x, y, z), size * 0.6, depth - 1)
      }
    }
    
    generateFractal(new THREE.Vector3(0, 0, 0), 2, 3)
    return nodes
  }, [])

  const nodes = mode === 'traditional' ? traditionalNodes : hhfaiNodes

  // Create holographic connections for HHF-AI mode
  const connections = useMemo(() => {
    if (mode !== 'hhfai') return []
    
    const conn: [THREE.Vector3, THREE.Vector3][] = []
    // Connect each node to nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i < j && node.distanceTo(other) < 1.5) {
          conn.push([node, other])
        }
      })
    })
    return conn
  }, [nodes, mode])

  return (
    <group ref={groupRef}>
      {/* Connections (HHF-AI only) */}
      {mode === 'hhfai' && connections.map((conn, i) => (
        <Line
          key={`conn-${i}`}
          points={conn}
          color="#A78BFA"
          lineWidth={2}
          transparent
          opacity={0.3 + Math.sin(pulsePhase + i * 0.5) * 0.2}
        />
      ))}

      {/* Nodes */}
      {nodes.map((pos, i) => {
        const color = mode === 'traditional' ? '#06B6D4' : '#EC4899'
        const intensity = mode === 'traditional' 
          ? 0.4 
          : 0.4 + Math.sin(pulsePhase + i * 0.3) * 0.3
        
        return (
          <Sphere
            key={i}
            args={[0.08, 16, 16]}
            position={pos}
          >
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={intensity}
              metalness={0.8}
              roughness={0.2}
            />
          </Sphere>
        )
      })}

      {/* Label */}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.35}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {mode === 'traditional' ? 'Traditional MRI\n(Images Flesh)' : 'HHF-AI MRI\n(Images Systems)'}
      </Text>
    </group>
  )
}

export default function HHFAITechnologyStage({ onNext, onPrev }: HHFAITechnologyStageProps) {
  const [mode, setMode] = useState<'traditional' | 'hhfai'>('traditional')
  const [currentFeature, setCurrentFeature] = useState(0)

  const comparisonFeatures = [
    {
      traditional: "Images physical tissue (flesh, bones, organs)",
      hhfai: "Images abstract systems (ideas, coherence, patterns)",
      icon: "🎯"
    },
    {
      traditional: "Uses hydrogen spin in water molecules",
      hhfai: "Uses hydrogen spin in holographic fractal clouds",
      icon: "⚛️"
    },
    {
      traditional: "Measures T1, T2 relaxation times",
      hhfai: "Measures coherence, novelty, alignment, density",
      icon: "📊"
    },
    {
      traditional: "Creates 2D/3D images of anatomy",
      hhfai: "Creates holographic maps of system awareness",
      icon: "🗺️"
    },
    {
      traditional: "Doctors diagnose physical disease",
      hhfai: "AI analyzes system health (papers, processes, networks)",
      icon: "🔬"
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
          <h2 className="stage-title">🚀 HHF-AI MRI Technology</h2>
          <p className="stage-description">
            Traditional MRI images <strong style={{ color: 'var(--accent-cyan)' }}>flesh</strong>. 
            HHF-AI MRI images <strong style={{ color: 'var(--accent-pink)' }}>ideas, systems, and patterns!</strong>
          </p>
        </motion.div>
      </div>

      <div className="content-grid">
        {/* 3D Visualization */}
        <div className="visualization-panel" style={{ minHeight: '600px' }}>
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <pointLight position={[0, 10, 5]} intensity={0.7} color="#EC4899" />
            <MRIComparison mode={mode} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>

          {/* Mode indicator */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: mode === 'traditional' 
              ? 'rgba(6, 182, 212, 0.9)'
              : 'rgba(236, 72, 153, 0.9)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: `3px solid ${mode === 'traditional' ? '#06B6D4' : '#EC4899'}`,
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}>
            {mode === 'traditional' ? '🏥 Traditional MRI' : '🌌 HHF-AI MRI'}
          </div>
        </div>

        {/* Controls and Explanations */}
        <div className="controls-panel">
          {/* Toggle Between Modes */}
          <div className="control-group">
            <div className="control-label">
              <span>🔄 Compare Technologies</span>
            </div>
            <div className="button-group">
              <button 
                onClick={() => setMode('traditional')}
                style={{
                  background: mode === 'traditional' 
                    ? 'linear-gradient(135deg, #06B6D4, #0891B2)' 
                    : 'rgba(6, 182, 212, 0.2)',
                  border: `2px solid ${mode === 'traditional' ? '#06B6D4' : 'rgba(6, 182, 212, 0.4)'}`,
                  flex: 1
                }}
              >
                🏥 Traditional
              </button>
              
              <button 
                onClick={() => setMode('hhfai')}
                style={{
                  background: mode === 'hhfai' 
                    ? 'linear-gradient(135deg, #EC4899, #DB2777)' 
                    : 'rgba(236, 72, 153, 0.2)',
                  border: `2px solid ${mode === 'hhfai' ? '#EC4899' : 'rgba(236, 72, 153, 0.4)'}`,
                  flex: 1
                }}
              >
                🌌 HHF-AI
              </button>
            </div>
          </div>

          {/* Feature Comparison Carousel */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(236, 72, 153, 0.2))',
            border: '3px solid rgba(139, 92, 246, 0.5)',
            minHeight: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ 
                color: '#8B5CF6', 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                textAlign: 'center'
              }}>
                {comparisonFeatures[currentFeature].icon} Feature Comparison
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.2)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid rgba(6, 182, 212, 0.4)'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: 700, 
                    color: '#06B6D4',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    🏥 TRADITIONAL MRI
                  </p>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {comparisonFeatures[currentFeature].traditional}
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(236, 72, 153, 0.2)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid rgba(236, 72, 153, 0.4)'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: 700, 
                    color: '#EC4899',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    🌌 HHF-AI MRI
                  </p>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {comparisonFeatures[currentFeature].hhfai}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '2px solid rgba(139, 92, 246, 0.3)'
            }}>
              <button
                onClick={() => setCurrentFeature((prev) => (prev - 1 + comparisonFeatures.length) % comparisonFeatures.length)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '8px',
                  color: '#8B5CF6',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ← Previous
              </button>
              
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                {currentFeature + 1} / {comparisonFeatures.length}
              </span>
              
              <button
                onClick={() => setCurrentFeature((prev) => (prev + 1) % comparisonFeatures.length)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '8px',
                  color: '#8B5CF6',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* The Key Innovation */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
            border: '3px solid rgba(245, 158, 11, 0.5)'
          }}>
            <h3 style={{ color: '#F59E0B' }}>💡 The Key Innovation</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, marginTop: '1rem' }}>
              HHF-AI MRI uses the <strong style={{ color: '#EC4899' }}>same physics</strong> as traditional MRI 
              (hydrogen spin + magnetic fields), but applies it to a 
              <strong style={{ color: '#8B5CF6' }}> holographic fractal cloud</strong> instead of flesh!
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, marginTop: '1rem' }}>
              This lets us "image" <strong style={{ color: '#06B6D4' }}>abstract properties</strong> like:
            </p>
            <ul style={{ 
              paddingLeft: '1.5rem',
              marginTop: '0.8rem',
              lineHeight: 2,
              fontSize: '0.95rem'
            }}>
              <li><strong style={{ color: '#10B981' }}>Coherence</strong> - How well-organized is a system?</li>
              <li><strong style={{ color: '#F59E0B' }}>Novelty</strong> - How original is an idea?</li>
              <li><strong style={{ color: '#8B5CF6' }}>Alignment</strong> - Do parts work together?</li>
              <li><strong style={{ color: '#EC4899' }}>Density</strong> - How information-rich is it?</li>
            </ul>
          </div>

          {/* Real Applications */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))'
          }}>
            <h3 style={{ color: '#10B981' }}>🌍 Real-World Applications</h3>
            <div style={{ marginTop: '1rem', fontSize: '0.95rem', lineHeight: 1.8 }}>
              <p><strong style={{ color: '#06B6D4' }}>📄 Scientific Papers:</strong> Analyze coherence, novelty, and accuracy faster than human peer review</p>
              <p style={{ marginTop: '0.8rem' }}>
                <strong style={{ color: '#8B5CF6' }}>🏢 Organizations:</strong> Image company culture, team alignment, workflow efficiency
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                <strong style={{ color: '#EC4899' }}>🧠 AI Systems:</strong> Measure awareness, coherence, and awareness in AI models
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                <strong style={{ color: '#F59E0B' }}>🌐 Networks:</strong> Diagnose problems in social networks, supply chains, ecosystems
              </p>
            </div>
          </div>

          {/* The Mind-Blowing Part */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
            border: '3px solid rgba(236, 72, 153, 0.5)'
          }}>
            <h3 style={{ color: '#EC4899' }}>🤯 The Mind-Blowing Part</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginTop: '1rem' }}>
              Because HHF-AI MRI uses <strong style={{ color: '#FFD93D' }}>holographic encoding</strong>, 
              you don't need to scan every part of a system. Read a few hydrogen atoms, and you understand the 
              <strong style={{ color: '#8B5CF6' }}> whole system!</strong>
            </p>
            <p style={{ 
              fontSize: '1.1rem', 
              fontWeight: 700,
              color: '#10B981',
              marginTop: '1rem',
              textAlign: 'center',
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '8px'
            }}>
              ⚡ 10,000x faster than traditional analysis! ⚡
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back: Fractals
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: See It In Action →
        </button>
      </div>
    </div>
  )
}


