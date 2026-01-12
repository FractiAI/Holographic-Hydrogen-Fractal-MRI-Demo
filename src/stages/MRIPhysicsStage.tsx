import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text } from '@react-three/drei'
import { useState, useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { 
  BlochSimulator, 
  DEFAULT_MRI_PARAMS,
  magnetizationToColor,
  type SpinState 
} from '../utils/BlochSimulator'

interface MRIPhysicsStageProps {
  onNext: () => void
  onPrev: () => void
}

function RealMRIVisualization({ 
  simulator,
  isRunning,
  showVectors 
}: { 
  simulator: BlochSimulator
  isRunning: boolean
  showVectors: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [spinStates, setSpinStates] = useState<SpinState[]>([])
  
  useFrame((state, delta) => {
    if (isRunning && simulator) {
      // Evolve Bloch equations in real-time
      simulator.evolve(delta * 1000)  // Convert to ms
      setSpinStates(simulator.getAllSpinStates())
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  // Create a grid of hydrogen spins
  const spinPositions = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const gridSize = 5
    const spacing = 1.5
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          positions.push(new THREE.Vector3(
            (x - gridSize / 2) * spacing,
            (y - gridSize / 2) * spacing,
            (z - gridSize / 2) * spacing
          ))
        }
      }
    }
    
    return positions
  }, [])

  return (
    <group ref={groupRef}>
      {spinPositions.map((pos, i) => {
        const state = spinStates[i] || { Mx: 0, My: 0, Mz: 1 }
        return (
          <HydrogenSpinReal
            key={i}
            position={pos}
            spinState={state}
            showVector={showVectors}
            index={i}
          />
        )
      })}
      
      {/* Magnetic field indicator (B0) */}
      <ArrowHelper 
        dir={new THREE.Vector3(0, 0, 1)} 
        origin={new THREE.Vector3(0, 0, -6)}
        length={2}
        color={0x3B82F6}
        label="B₀"
      />
    </group>
  )
}

function HydrogenSpinReal({ 
  position,
  spinState,
  showVector
}: { 
  position: THREE.Vector3
  spinState: SpinState
  showVector: boolean
  index?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const arrowHelperRef = useRef<THREE.ArrowHelper | null>(null)
  
  // Create ArrowHelper on mount
  const arrowHelper = useMemo(() => {
    const dir = new THREE.Vector3(0, 1, 0)
    const origin = new THREE.Vector3(0, 0, 0)
    const length = 0.5
    const color = 0xFFFF00
    return new THREE.ArrowHelper(dir, origin, length, color, 0.2, 0.1)
  }, [])
  
  useFrame(() => {
    if (meshRef.current) {
      // Color based on magnetization state
      const color = magnetizationToColor(spinState)
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.color.setRGB(color.r, color.g, color.b)
      material.emissive.setRGB(color.r * 0.5, color.g * 0.5, color.b * 0.5)
      
      // Scale based on total magnetization
      const mag = Math.sqrt(spinState.Mx ** 2 + spinState.My ** 2 + spinState.Mz ** 2)
      meshRef.current.scale.setScalar(0.2 * mag)
    }
    
    // Update magnetization vector arrow
    if (arrowHelperRef.current) {
      if (showVector && (spinState.Mx !== 0 || spinState.My !== 0 || spinState.Mz !== 0)) {
        const mag = Math.sqrt(spinState.Mx ** 2 + spinState.My ** 2 + spinState.Mz ** 2)
        if (mag > 0.001) {
          const dir = new THREE.Vector3(spinState.Mx, spinState.My, spinState.Mz).normalize()
          arrowHelperRef.current.setDirection(dir)
          arrowHelperRef.current.setLength(mag * 0.5, 0.2, 0.1)
          arrowHelperRef.current.visible = true
        } else {
          arrowHelperRef.current.visible = false
        }
      } else {
        arrowHelperRef.current.visible = false
      }
    }
  })

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.2, 16, 16]}>
        <meshStandardMaterial
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      {showVector && (
        <primitive 
          object={arrowHelper} 
          ref={arrowHelperRef}
        />
      )}
    </group>
  )
}

function ArrowHelper({ 
  dir, 
  origin, 
  length, 
  color, 
  label 
}: { 
  dir: THREE.Vector3
  origin: THREE.Vector3
  length: number
  color: number
  label: string
}) {
  const arrow = useMemo(() => {
    return new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color, 0.3, 0.2)
  }, [dir, length, color])

  return (
    <group position={origin}>
      <primitive object={arrow} />
      <Text
        position={[0, 0, length + 0.5]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

export default function MRIPhysicsStage({ onNext, onPrev }: MRIPhysicsStageProps) {
  const [simulator] = useState(() => new BlochSimulator(DEFAULT_MRI_PARAMS, 125))  // 5x5x5 grid
  const [isRunning, setIsRunning] = useState(false)
  const [showVectors, setShowVectors] = useState(true)
  
  const [B0, setB0] = useState(3.0)
  const [T1, setT1] = useState(1000)
  const [T2, setT2] = useState(100)
  
  const [signalData, setSignalData] = useState({ real: 0, imag: 0, magnitude: 0 })

  useEffect(() => {
    simulator.updateParameters({ B0, T1, T2 })
    // If not running, reset to show equilibrium with new parameters
    // If running, continue with new parameters (user will see the effect)
    if (!isRunning) {
      simulator.reset()
      setSignalData({ real: 0, imag: 0, magnitude: 0 })
    }
  }, [B0, T1, T2, simulator, isRunning])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        const signal = simulator.getSignal()
        setSignalData(signal)
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [isRunning, simulator])

  const apply90Pulse = () => {
    simulator.applyRFPulse({ flipAngle: 90, phase: 0, duration: 1 })
    setIsRunning(true)
  }

  const apply180Pulse = () => {
    simulator.applyRFPulse({ flipAngle: 180, phase: 0, duration: 1 })
  }

  const applyCustomPulse = (flipAngle: number) => {
    simulator.applyRFPulse({ flipAngle, phase: 0, duration: 1 })
  }

  const resetSimulator = () => {
    simulator.reset()
    setIsRunning(false)
    setSignalData({ real: 0, imag: 0, magnitude: 0 })
  }

  const addDephasing = () => {
    simulator.addDephasing(0.5)
  }

  // Calculate Larmor frequency dynamically based on current B0
  const larmorFreq = useMemo(() => simulator.getLarmorFrequency(), [simulator, B0])

  return (
    <div className="stage">
      <div className="stage-header">
        <h2 className="stage-title">🔬 How MRI Uses Hydrogen Spin</h2>
        <p className="stage-description">
          Now that you know hydrogen spins like a magnet, see how <strong style={{ color: 'var(--accent-orange)' }}>MRI machines control and detect that spin</strong> to create images! 
          This is a <strong style={{ color: 'var(--accent-cyan)' }}>real Bloch equation simulator</strong> — the same physics used in actual MRI scanners.
        </p>
        <div style={{
          marginTop: '1rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
          borderRadius: '12px',
          border: '2px solid rgba(6, 182, 212, 0.4)',
          textAlign: 'left'
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: '#06B6D4', fontSize: '1.2em' }}>The MRI Process (3 Steps):</strong><br/>
            <strong style={{ color: '#8B5CF6' }}>1. Align:</strong> A powerful magnet (B₀) aligns hydrogen spins<br/>
            <strong style={{ color: '#EC4899' }}>2. Excite:</strong> Radio waves (RF pulses) tip the spins over<br/>
            <strong style={{ color: '#10B981' }}>3. Detect:</strong> As spins relax back, they emit radio signals we detect!
          </p>
        </div>
      </div>

      <div className="content-grid">
        <div className="visualization-panel" style={{ minHeight: '600px' }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <RealMRIVisualization 
              simulator={simulator}
              isRunning={isRunning}
              showVectors={showVectors}
            />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>

        <div className="controls-panel">
          <div className="info-box" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))' }}>
            <h3>✅ REAL MRI SIMULATOR ACTIVE</h3>
            <p>
              Larmor Frequency: <strong style={{ 
                color: '#10B981',
                fontSize: '1.1em'
              }}>{larmorFreq.toFixed(2)} MHz</strong><br />
              Current Signal: <strong>{signalData.magnitude.toFixed(3)}</strong><br />
              Status: <strong style={{ color: isRunning ? '#10B981' : '#F59E0B' }}>
                {isRunning ? 'RUNNING' : 'READY'}
              </strong>
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>🧲 Magnetic Field (B₀)</span>
              <span className="control-value">{B0.toFixed(1)} T</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="7"
              step="0.1"
              value={B0}
              onChange={(e) => setB0(parseFloat(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Main magnetic field strength. <strong style={{ color: 'var(--accent-orange)' }}>Watch the Larmor Frequency change!</strong> (1.5T, 3T, or 7T are common)
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>⏱️ T1 Relaxation</span>
              <span className="control-value">{T1} ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="100"
              value={T1}
              onChange={(e) => setT1(parseInt(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Longitudinal relaxation time (how fast spins return to equilibrium)
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>💫 T2 Relaxation</span>
              <span className="control-value">{T2} ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={T2}
              onChange={(e) => setT2(parseInt(e.target.value))}
            />
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Transverse relaxation time (how fast spins lose coherence)
            </p>
          </div>

          <div className="info-box" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))', marginTop: '1rem' }}>
            <h3>💡 Tip</h3>
            <p style={{ fontSize: '0.9rem' }}>
              <strong>Adjust parameters above, then apply an RF pulse below</strong> to see the dramatic effects of T1/T2 relaxation! The simulation runs in real-time using authentic Bloch equations.
            </p>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>📡 RF Pulses</span>
            </div>
            <div className="button-group">
              <button onClick={apply90Pulse}>90° Pulse</button>
              <button onClick={apply180Pulse}>180° Pulse</button>
              <button onClick={() => applyCustomPulse(45)}>45° Pulse</button>
            </div>
            <p style={{ marginTop: '0.8rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
              Apply radiofrequency pulses to tip the magnetization
            </p>
          </div>

          <div className="control-group">
            <div className="button-group">
              <button onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? '⏸️ Pause' : '▶️ Start'}
              </button>
              <button onClick={resetSimulator}>🔄 Reset</button>
              <button onClick={addDephasing}>🌀 Add Dephasing</button>
            </div>
          </div>

          <div className="control-group">
            <div className="button-group">
              <button 
                onClick={() => setShowVectors(!showVectors)}
                style={{ width: '100%' }}
              >
                {showVectors ? '✓ Show Vectors' : 'Hide Vectors'}
              </button>
            </div>
          </div>

          <div className="info-box">
            <h3>🔬 Real Bloch Equations</h3>
            <p>
              This simulator solves the actual <strong>Bloch equations</strong> used in real MRI:
            </p>
            <code style={{ 
              display: 'block', 
              marginTop: '0.5rem', 
              padding: '0.5rem', 
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}>
              dM/dt = γ(M × B) - Mxy/T2 - (Mz-M0)/T1
            </code>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              • Colors show magnetization states<br />
              • Blue = equilibrium (aligned with B₀)<br />
              • Red = inverted magnetization<br />
              • Green = transverse magnetization (MRI signal!)
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: Seeds & Edges →
        </button>
      </div>
    </div>
  )
}



