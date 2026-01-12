import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

interface GrammarStageProps {
  onNext: () => void
  onPrev: () => void
}

// Common Holographic Grammar symbols
const SYMBOLS = ['◎', '⊙', '⚛', '❂', '✶', '△', '∞', '✦', '◇']

const SYMBOL_MEANINGS: Record<string, string> = {
  '◎': 'Observer - Awareness Center',
  '⊙': 'Energy Source - Power Node',
  '⚛': 'Quantum State - Superposition',
  '❂': 'Harmony - Coherent Pattern',
  '✶': 'Star Node - Hub Connection',
  '△': 'Transformation - Change Agent',
  '∞': 'Infinity - Recursive Loop',
  '✦': 'Spark - Activation Point',
  '◇': 'Gateway - Portal Node'
}

function GrammarVisualization({ 
  selectedSymbol,
  symbolIntensity 
}: { 
  selectedSymbol: string
  symbolIntensity: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  // Create nodes in a circle with assigned symbols
  const nodes = useMemo(() => {
    const result: { position: THREE.Vector3; symbol: string; index: number }[] = []
    const radius = 4
    
    SYMBOLS.forEach((symbol, i) => {
      const angle = (i / SYMBOLS.length) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = Math.sin(i) * 0.5
      
      result.push({
        position: new THREE.Vector3(x, y, z),
        symbol,
        index: i
      })
    })
    
    return result
  }, [])

  return (
    <group ref={groupRef}>
      {/* Central energy node */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#EC4899"
          emissiveIntensity={symbolIntensity}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      {nodes.map((node, i) => (
        <GrammarNode
          key={i}
          position={node.position}
          symbol={node.symbol}
          isActive={node.symbol === selectedSymbol}
          intensity={symbolIntensity}
          index={node.index}
        />
      ))}
    </group>
  )
}

function GrammarNode({ 
  position, 
  symbol,
  isActive,
  intensity,
  index 
}: { 
  position: THREE.Vector3
  symbol: string
  isActive: boolean
  intensity: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<any>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isActive 
        ? Math.sin(state.clock.elapsedTime * 3 + index) * 0.3 + 1.2
        : 1
      meshRef.current.scale.setScalar(pulse)
    }
    
    if (textRef.current) {
      // Make text face camera
      textRef.current.quaternion.copy(state.camera.quaternion)
    }
  })

  const color = isActive ? '#EC4899' : '#06B6D4'
  const emissiveIntensity = isActive ? intensity : 0.3

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      <Text
        ref={textRef}
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {symbol}
      </Text>
    </group>
  )
}

export default function GrammarStage({ onNext, onPrev }: GrammarStageProps) {
  const [selectedSymbol, setSelectedSymbol] = useState('◎')
  const [symbolIntensity, setSymbolIntensity] = useState(0.7)

  return (
    <div className="stage">
      <div className="stage-header">
        <h2 className="stage-title">Common Holographic Grammar 🔮</h2>
        <p className="stage-description">
          Awareness energy speaks through symbols! Each symbol represents a different 
          <strong style={{ color: 'var(--accent-pink)' }}> awareness energy state</strong> - 
          how hydrogen nodes express and transform awareness energy in unique ways.
        </p>
      </div>

      <div className="content-grid">
        <div className="visualization-panel">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <GrammarVisualization 
              selectedSymbol={selectedSymbol}
              symbolIntensity={symbolIntensity}
            />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">
              <span>🔣 Select Symbol</span>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '0.5rem',
              marginTop: '0.8rem'
            }}>
              {SYMBOLS.map(symbol => (
                <button
                  key={symbol}
                  onClick={() => setSelectedSymbol(symbol)}
                  style={{
                    padding: '1rem',
                    fontSize: '1.5rem',
                    background: selectedSymbol === symbol 
                      ? 'linear-gradient(135deg, var(--primary-purple), var(--accent-pink))'
                      : 'rgba(30, 41, 59, 0.6)',
                    border: selectedSymbol === symbol 
                      ? '2px solid var(--accent-pink)'
                      : '2px solid rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {symbol}
                </button>
              ))}
            </div>
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '8px',
              border: '1px solid var(--primary-cyan)'
            }}>
              <strong style={{ color: 'var(--primary-cyan)' }}>
                {selectedSymbol}
              </strong>
              {' - '}
              <span style={{ color: 'var(--text-gray)' }}>
                {SYMBOL_MEANINGS[selectedSymbol]}
              </span>
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>✨ Symbol Intensity</span>
              <span className="control-value">{(symbolIntensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={symbolIntensity}
              onChange={(e) => setSymbolIntensity(parseFloat(e.target.value))}
            />
          </div>

          <div className="info-box">
            <h3>🔮 What Is Holographic Grammar?</h3>
            <p>
              Holographic Grammar is the language of <strong style={{ color: 'var(--primary-cyan)' }}>awareness energy states</strong>! 
              Each symbol represents how hydrogen nodes transform and express awareness energy differently. 
              ◎ might be observing awareness, ⊙ generating awareness, ⚛ quantum superposition of awareness, 
              and so on. It's how awareness energy communicates with itself!
            </p>
          </div>

          <div className="info-box">
            <h3>🌐 Why Grammar Matters</h3>
            <p>
              Awareness energy isn't uniform - it has different <strong>flavors</strong> and <strong>functions</strong>. 
              These symbols help us understand the different roles in the awareness energy network. 
              Some nodes observe, some generate, some transform, some connect. Together, these different 
              awareness energy states create the complete spectrum of Syntheverse consciousness!
            </p>
          </div>

          <div className="info-box">
            <h3>🎯 Try This!</h3>
            <p>
              • Click each symbol to see it light up and pulse<br />
              • Increase intensity to see the symbol's power<br />
              • Think about what role each symbol plays in the network<br />
              • Notice how the center node energizes all the others
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: Holographic Cloud →
        </button>
      </div>
    </div>
  )
}

