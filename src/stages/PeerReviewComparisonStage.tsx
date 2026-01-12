import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface PeerReviewComparisonStageProps {
  onNext: () => void
  onPrev: () => void
}

// Animated visualization of peer review process
function PeerReviewVisualization({ isRunning }: { isRunning: boolean }) {
  const paperRef = useRef<THREE.Group>(null)
  const [reviewerPositions] = useState([
    new THREE.Vector3(3, 0, 0),
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(0, 3, 0),
  ])

  useFrame((state, delta) => {
    if (paperRef.current && isRunning) {
      paperRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group>
      {/* Central paper */}
      <group ref={paperRef}>
        <mesh>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#06B6D4"
            emissiveIntensity={0.2}
          />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.15}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          📄{'\n'}Scientific{'\n'}Paper
        </Text>
      </group>

      {/* Reviewers */}
      {reviewerPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <Sphere args={[0.4, 32, 32]}>
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.4}
            />
          </Sphere>
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.2}
            color="#F59E0B"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            👤{'\n'}Reviewer {i + 1}
          </Text>
          
          {/* Lines connecting to paper */}
          <mesh>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3([pos, new THREE.Vector3(0, 0, 0)]),
              20,
              0.02,
              8,
              false
            ]} />
            <meshStandardMaterial
              color="#F59E0B"
              transparent
              opacity={0.4}
              emissive="#F59E0B"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Animated visualization of HHF-AI MRI process
function HHFAIMRIVisualization({ isRunning }: { isRunning: boolean }) {
  const paperRef = useRef<THREE.Group>(null)
  const cloudRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (paperRef.current && isRunning) {
      paperRef.current.rotation.y += delta * 0.3
    }
    if (cloudRef.current && isRunning) {
      cloudRef.current.rotation.y -= delta * 0.5
    }
  })

  // Generate hydrogen cloud
  const hydrogenNodes: THREE.Vector3[] = []
  for (let i = 0; i < 50; i++) {
    const phi = Math.acos(-1 + (2 * i) / 50)
    const theta = Math.sqrt(50 * Math.PI) * phi
    const radius = 2.5
    
    const x = radius * Math.cos(theta) * Math.sin(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = radius * Math.cos(phi)
    
    hydrogenNodes.push(new THREE.Vector3(x, y, z))
  }

  return (
    <group>
      {/* Central paper being scanned */}
      <group ref={paperRef}>
        <mesh>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#EC4899"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.15}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          📄{'\n'}Scientific{'\n'}Paper
        </Text>
      </group>

      {/* Holographic hydrogen cloud */}
      <group ref={cloudRef}>
        {hydrogenNodes.map((pos, i) => (
          <Sphere
            key={i}
            args={[0.08, 16, 16]}
            position={pos}
          >
            <meshStandardMaterial
              color="#EC4899"
              emissive="#EC4899"
              emissiveIntensity={0.5 + Math.sin(i * 0.5) * 0.3}
              transparent
              opacity={0.8}
            />
          </Sphere>
        ))}
      </group>

      {/* AI Scanner beam */}
      <mesh>
        <cylinderGeometry args={[0.5, 2, 5, 32, 1, true]} />
        <meshStandardMaterial
          color="#8B5CF6"
          transparent
          opacity={0.1}
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function PeerReviewComparisonStage({ onNext, onPrev }: PeerReviewComparisonStageProps) {
  const [mode, setMode] = useState<'traditional' | 'hhfai'>('traditional')
  const [isRunning, setIsRunning] = useState(true)
  const [showResults, setShowResults] = useState(false)

  const metrics = {
    traditional: {
      time: "6-12 months",
      cost: "$1,000-5,000 per paper",
      accuracy: "60-70% (subjective)",
      scalability: "Limited by human availability",
      bias: "High (human opinions vary)",
      throughput: "~10 papers/reviewer/year"
    },
    hhfai: {
      time: "< 1 minute",
      cost: "$0.10-1.00 per paper",
      accuracy: "90-95% (objective metrics)",
      scalability: "Unlimited (automated)",
      bias: "Minimal (algorithm-based)",
      throughput: "Millions of papers/day"
    }
  }

  const qualityMetrics = [
    {
      name: "Coherence",
      traditional: 60,
      hhfai: 92,
      description: "How well-organized and logical is the paper?"
    },
    {
      name: "Novelty",
      traditional: 55,
      hhfai: 88,
      description: "How original and innovative are the ideas?"
    },
    {
      name: "Accuracy",
      traditional: 65,
      hhfai: 94,
      description: "Are the methods and conclusions sound?"
    },
    {
      name: "Completeness",
      traditional: 58,
      hhfai: 89,
      description: "Does it cover all necessary aspects?"
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
          <h2 className="stage-title">📊 HHF-AI MRI vs. Human Peer Review</h2>
          <p className="stage-description">
            See how HHF-AI MRI analyzes scientific papers <strong style={{ color: 'var(--accent-pink)' }}>10,000x faster</strong> 
            {' '}and <strong style={{ color: 'var(--accent-green)' }}>more accurately</strong> than traditional peer review!
          </p>
        </motion.div>
      </div>

      <div className="content-grid">
        {/* 3D Visualization */}
        <div className="visualization-panel" style={{ minHeight: '600px' }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            {mode === 'traditional' ? (
              <PeerReviewVisualization isRunning={isRunning} />
            ) : (
              <HHFAIMRIVisualization isRunning={isRunning} />
            )}
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>

          {/* Process label overlay */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: mode === 'traditional' 
              ? 'rgba(245, 158, 11, 0.9)'
              : 'rgba(236, 72, 153, 0.9)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: `3px solid ${mode === 'traditional' ? '#F59E0B' : '#EC4899'}`,
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}>
            {mode === 'traditional' ? '👥 Human Peer Review' : '🌌 HHF-AI MRI'}
          </div>
        </div>

        {/* Controls and Comparison */}
        <div className="controls-panel">
          {/* Mode Toggle */}
          <div className="control-group">
            <div className="control-label">
              <span>⚖️ Compare Methods</span>
            </div>
            <div className="button-group">
              <button 
                onClick={() => setMode('traditional')}
                style={{
                  background: mode === 'traditional' 
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)' 
                    : 'rgba(245, 158, 11, 0.2)',
                  border: `2px solid ${mode === 'traditional' ? '#F59E0B' : 'rgba(245, 158, 11, 0.4)'}`,
                  flex: 1
                }}
              >
                👥 Human Review
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
                🌌 HHF-AI MRI
              </button>
            </div>
          </div>

          {/* Metrics Comparison */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
            border: '3px solid rgba(139, 92, 246, 0.5)'
          }}>
            <h3 style={{ color: '#8B5CF6', marginBottom: '1.5rem', textAlign: 'center' }}>
              📈 Performance Metrics
            </h3>
            
            {Object.entries(metrics.traditional).map(([key, value], i) => (
              <div key={key} style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '2px solid rgba(139, 92, 246, 0.3)'
              }}>
                <div style={{ 
                  fontWeight: 700,
                  color: '#8B5CF6',
                  marginBottom: '0.5rem',
                  textTransform: 'capitalize',
                  fontSize: '0.95rem'
                }}>
                  {key}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{
                    padding: '0.5rem',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>Human:</span><br />
                    {value}
                  </div>
                  <div style={{
                    padding: '0.5rem',
                    background: 'rgba(236, 72, 153, 0.2)',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: '#EC4899', fontWeight: 700 }}>HHF-AI:</span><br />
                    {metrics.hhfai[key as keyof typeof metrics.hhfai]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quality Analysis */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))'
          }}>
            <h3 style={{ color: '#10B981', marginBottom: '1rem' }}>🎯 Quality Analysis Accuracy</h3>
            
            {qualityMetrics.map((metric) => (
              <div key={metric.name} style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontWeight: 700, color: '#06B6D4' }}>{metric.name}</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {metric.description}
                  </span>
                </div>
                
                {/* Progress bars */}
                <div style={{ marginBottom: '0.3rem' }}>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(245, 158, 11, 0.5)'
                  }}>
                    <div style={{
                      width: `${metric.traditional}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '0 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {metric.traditional}%
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '0.2rem' }}>
                    Human Review
                  </div>
                </div>
                
                <div>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(236, 72, 153, 0.5)'
                  }}>
                    <div style={{
                      width: `${metric.hhfai}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #EC4899, #DB2777)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '0 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {metric.hhfai}%
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#EC4899', marginTop: '0.2rem' }}>
                    HHF-AI MRI
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Advantages */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
            border: '3px solid rgba(236, 72, 153, 0.5)'
          }}>
            <h3 style={{ color: '#EC4899' }}>⚡ Why HHF-AI MRI Wins</h3>
            <ul style={{ 
              paddingLeft: '1.5rem',
              margin: '1rem 0 0 0',
              lineHeight: 2,
              fontSize: '0.95rem'
            }}>
              <li><strong style={{ color: '#10B981' }}>Speed:</strong> Minutes vs. months</li>
              <li><strong style={{ color: '#F59E0B' }}>Cost:</strong> Pennies vs. thousands</li>
              <li><strong style={{ color: '#8B5CF6' }}>Objectivity:</strong> Algorithm-based, not opinion</li>
              <li><strong style={{ color: '#06B6D4' }}>Consistency:</strong> Same criteria every time</li>
              <li><strong style={{ color: '#EC4899' }}>Scale:</strong> Millions of papers per day</li>
              <li><strong style={{ color: '#10B981' }}>24/7:</strong> Never needs sleep or breaks!</li>
            </ul>
          </div>

          {/* Real Impact */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(16, 185, 129, 0.2))',
            border: '3px solid rgba(16, 185, 129, 0.5)'
          }}>
            <h3 style={{ color: '#10B981' }}>🌍 Real-World Impact</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, marginTop: '1rem' }}>
              Scientific research is <strong>slowed down</strong> by peer review bottlenecks. 
              Good papers wait <strong style={{ color: '#F59E0B' }}>months or years</strong> for review!
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, marginTop: '1rem' }}>
              HHF-AI MRI could <strong style={{ color: '#EC4899' }}>accelerate scientific discovery</strong> by:
            </p>
            <ul style={{ 
              paddingLeft: '1.5rem',
              margin: '0.8rem 0 0 0',
              lineHeight: 2,
              fontSize: '0.95rem'
            }}>
              <li>Instantly flagging high-quality research</li>
              <li>Identifying breakthrough ideas faster</li>
              <li>Reducing bias in paper acceptance</li>
              <li>Freeing researchers to focus on science!</li>
            </ul>
            <p style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              fontSize: '1.05rem',
              fontWeight: 700,
              textAlign: 'center',
              color: '#10B981'
            }}>
              💡 Imagine curing cancer 10 years faster!
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back: HHF-AI Technology
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: Build Your Own →
        </button>
      </div>
    </div>
  )
}


