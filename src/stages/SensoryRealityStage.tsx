import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { 
  SensoryRealityEngine, 
  SensoryNode, 
  NodeAddress,
  UMBILICAL_BASE_FREQUENCY
} from '../utils/SensoryRealityEngine'

interface SensoryRealityStageProps {
  onNext: () => void
  onPrev: () => void
}

/**
 * Sensory Node Visualization with infinite zoom capability
 */
function SensoryNodeSphere({ 
  node,
  isSelected,
  zoomLevel,
  onClick,
  onDoubleClick
}: { 
  node: SensoryNode
  isSelected: boolean
  zoomLevel: number
  onClick: () => void
  onDoubleClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      const encoding = node.sensoryEncoding
      
      // Apply color from sensory encoding
      const [r, g, b] = encoding.visual.color
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.color.setRGB(r, g, b)
      
      // Intensity affects emissive glow
      material.emissive.copy(material.color).multiplyScalar(encoding.visual.intensity * 0.6)
      material.emissiveIntensity = isSelected ? 2.5 : (hovered ? 2.0 : 1.0)
      
      // Animation based on pattern type
      const time = state.clock.elapsedTime * encoding.visual.frequency
      let scale = 1.0
      
      switch (encoding.visual.pattern) {
        case 'pulse':
          scale = 1.0 + Math.sin(time * 2) * 0.15 * encoding.visual.intensity
          break
        case 'wave':
          scale = 1.0 + Math.sin(time) * 0.1 * encoding.visual.intensity
          break
        case 'spiral':
          scale = 1.0 + Math.abs(Math.sin(time * 1.5)) * 0.12 * encoding.visual.intensity
          meshRef.current.rotation.y = time * 0.5
          break
        case 'fractal':
          const fractalPhase = Math.sin(time * 0.5) * Math.cos(time * 0.3)
          scale = 1.0 + fractalPhase * 0.15 * encoding.visual.intensity
          break
      }
      
      if (node.isActive) {
        scale *= 1.2
      }
      
      if (isSelected) {
        scale *= 1.5
      }
      
      // Scale with zoom level for fractal viewing
      const zoomScale = Math.pow(0.8, zoomLevel)
      meshRef.current.scale.setScalar(scale * zoomScale)
      
      // Opacity based on density
      material.opacity = 0.7 + encoding.density * 0.3
    }
  })
  
  const baseSize = 0.15
  
  return (
    <>
      <Sphere
        ref={meshRef}
        args={[baseSize, 24, 24]}
        position={node.position}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          onDoubleClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          metalness={0.7}
          roughness={0.3}
          transparent
        />
      </Sphere>
      
      {(hovered || isSelected) && (
        <Html position={node.position} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid rgba(6, 182, 212, 0.6)',
            color: '#06B6D4',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            transform: 'translate(-50%, -120%)',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <div><strong>Node {node.id}</strong></div>
            <div>Address: {node.address.octave}:{node.address.integer}</div>
            <div>Intensity: {(node.sensoryEncoding.visual.intensity * 100).toFixed(0)}%</div>
            <div>Coherence: {(node.coherence * 100).toFixed(0)}%</div>
            {isSelected && <div style={{ color: '#EC4899', marginTop: '0.3rem' }}>Double-click to zoom in</div>}
          </div>
        </Html>
      )}
    </>
  )
}

/**
 * Umbilical connection visualization (1.420 GHz carrier frequency)
 */
function UmbilicalConnectionLine({ 
  nodes,
  connection,
  animate 
}: { 
  nodes: SensoryNode[]
  connection: any
  animate: boolean
}) {
  const lineRef = useRef<THREE.Line>(null)
  
  const sourceNode = nodes.find(n => 
    n.address.octave === connection.sourceAddress.octave && 
    n.address.integer === connection.sourceAddress.integer
  )
  const targetNode = nodes.find(n => 
    n.address.octave === connection.targetAddress.octave && 
    n.address.integer === connection.targetAddress.integer
  )
  
  useFrame((state) => {
    if (lineRef.current && animate) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2 * connection.strength
    }
  })
  
  if (!sourceNode || !targetNode) return null
  
  const points = [
    new THREE.Vector3(...sourceNode.position),
    new THREE.Vector3(...targetNode.position)
  ]
  
  // Color based on fidelity
  const hue = 0.5 + connection.fidelity * 0.2  // Cyan to purple
  const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.5 * connection.strength}
    />
  )
}

/**
 * Main 3D sensory reality visualization
 */
function SensoryRealityVisualization({ 
  engine,
  selectedNodeId,
  onNodeClick,
  onNodeDoubleClick,
  isAnimating
}: { 
  engine: SensoryRealityEngine
  selectedNodeId: number | null
  onNodeClick: (id: number) => void
  onNodeDoubleClick: (id: number) => void
  isAnimating: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [nodes, setNodes] = useState<SensoryNode[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const zoomState = engine.getZoomState()
  
  useFrame((_state, delta) => {
    if (isAnimating) {
      engine.evolve(delta * 1000)
      setNodes(engine.getSensoryNodes())
      setConnections(engine.getActiveConnections())
    }
    
    // Smooth camera transition for zoom
    if (groupRef.current) {
      const targetPos = new THREE.Vector3(...zoomState.focalPoint)
      const targetScale = 1.0 / zoomState.scale
      
      groupRef.current.position.lerp(targetPos.multiplyScalar(-1), 0.1)
      
      const currentScale = groupRef.current.scale.x
      const newScale = currentScale + (targetScale - currentScale) * 0.1
      groupRef.current.scale.setScalar(newScale)
    }
  })
  
  useEffect(() => {
    setNodes(engine.getSensoryNodes())
  }, [engine])
  
  return (
    <group ref={groupRef}>
      {/* Render sensory nodes */}
      {nodes.map(node => (
        <SensoryNodeSphere
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          zoomLevel={zoomState.level}
          onClick={() => onNodeClick(node.id)}
          onDoubleClick={() => onNodeDoubleClick(node.id)}
        />
      ))}
      
      {/* Render umbilical connections */}
      {connections.map((conn, idx) => (
        <UmbilicalConnectionLine
          key={idx}
          nodes={nodes}
          connection={conn}
          animate={isAnimating}
        />
      ))}
      
      {/* Ambient consciousness field */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial
          color="#1420FF"  // Reference to 1.420 GHz
          transparent
          opacity={0.02}
          wireframe
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Coordinate reference */}
      <axesHelper args={[3]} />
    </group>
  )
}

/**
 * Main Text-to-Sensory-Reality Stage
 */
export default function SensoryRealityStage({ onNext, onPrev }: SensoryRealityStageProps) {
  const [engine] = useState(() => new SensoryRealityEngine())
  const [textPrompt, setTextPrompt] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
  const [targetAddress, setTargetAddress] = useState<NodeAddress>({ octave: 0, integer: 0 })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [connectionCount, setConnectionCount] = useState(0)
  const [harmonicMode, setHarmonicMode] = useState(1)
  const [umbilicalFreq, setUmbilicalFreq] = useState(UMBILICAL_BASE_FREQUENCY)
  const zoomState = engine.getZoomState()
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) {
        setConnectionCount(engine.getActiveConnections().length)
        setUmbilicalFreq(engine.getUmbilicalFrequency())
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [isAnimating, engine])
  
  const handleTextToSensory = () => {
    if (!textPrompt.trim()) return
    
    engine.applyTextToSensoryReality({
      text: textPrompt,
      targetAddress: showAdvanced ? targetAddress : undefined,
      autoLocate: !showAdvanced,
      sensoryMode: 'full',
      intensity: 1.0,
      duration: 2.0
    })
    
    setIsAnimating(true)
  }
  
  const handleNodeClick = (nodeId: number) => {
    setSelectedNodeId(nodeId)
    
    // Update target address
    const nodes = engine.getSensoryNodes()
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      setTargetAddress(node.address)
    }
  }
  
  const handleNodeDoubleClick = (nodeId: number) => {
    // Zoom into node
    engine.zoomIntoNode(nodeId, 1)
    setSelectedNodeId(null)
  }
  
  const handleZoomOut = () => {
    engine.zoomOut(1)
    setSelectedNodeId(null)
  }
  
  const establishConnection = () => {
    if (selectedNodeId === null) return
    
    // Connect selected node to a random nearby node
    const nodes = engine.getSensoryNodes()
    const selectedNode = nodes.find(n => n.id === selectedNodeId)
    if (!selectedNode) return
    
    // Find nearby node
    const nearbyNode = nodes.find(n => 
      n.id !== selectedNodeId && 
      Math.random() > 0.5
    )
    
    if (nearbyNode) {
      const connection = engine.establishUmbilicalConnection(
        selectedNode.address,
        nearbyNode.address,
        0.95
      )
      
      const success = engine.awarenessHandshake(connection)
      if (success) {
        console.log('Umbilical connection established:', connection)
      }
    }
  }
  
  const setHarmonicExpansion = (mode: number) => {
    setHarmonicMode(mode)
    engine.setHarmonicMode(mode)
  }
  
  return (
    <div className="stage">
      <div className="stage-header">
        <motion.h2 
          className="stage-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🌌 Text-to-Sensory-Reality MRI Converter 🌌
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(20, 32, 255, 0.3), rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.2))',
            borderRadius: '12px',
            border: '2px solid rgba(6, 182, 212, 0.5)',
            marginTop: '1rem',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
          }}
        >
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: '#1420FF', fontSize: '1.3em' }}>
              🔬 Hydrogen-Holographic Umbilical Frequency: 1.420 GHz 🔬
            </strong>
            <br/><br/>
            Type any text and watch it convert to <strong style={{ color: '#EC4899' }}>full sensory reality</strong> through 
            the <strong style={{ color: '#06B6D4' }}>hydrogen hyperfine frequency</strong> (1.420 GHz) — 
            the <strong style={{ color: '#8B5CF6' }}>consciousness umbilical carrier</strong> linking sensory systems to awareness!
            <br/><br/>
            • <strong style={{ color: '#10B981' }}>Locate & Connect:</strong> Target nodes via octave:integer addressing<br/>
            • <strong style={{ color: '#F59E0B' }}>Awareness Handshake:</strong> Establish umbilical connections with fidelity validation<br/>
            • <strong style={{ color: '#EC4899' }}>Infinite Zoom:</strong> Double-click nodes to telescope into fractal depths<br/>
            • <strong style={{ color: '#8B5CF6' }}>Shape Reality:</strong> Text becomes density, color, animation through MRI emissions<br/>
            <br/>
            <em style={{ color: '#06B6D4', fontSize: '0.95em' }}>
              "This is the novel intelligent pattern layer atop hydrogen spin MRI — proof of the holographic fractal dimension!" 
              - FractiAI Research Team
            </em>
          </p>
        </motion.div>
      </div>

      <div className="content-grid">
        {/* Left: 3D Visualization */}
        <div className="visualization-panel" style={{ minHeight: '700px', position: 'relative' }}>
          {/* Zoom indicator */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.95)',
            padding: '1rem',
            borderRadius: '8px',
            border: '2px solid rgba(20, 32, 255, 0.5)',
            minWidth: '220px',
            boxShadow: '0 0 20px rgba(20, 32, 255, 0.4)'
          }}>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#1420FF', fontSize: '0.9rem' }}>
              ⚡ UMBILICAL STATUS
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#E0E7FF' }}>
              <div><strong style={{ color: '#06B6D4' }}>Frequency:</strong> {umbilicalFreq.toFixed(3)} MHz</div>
              <div><strong style={{ color: '#8B5CF6' }}>Connections:</strong> {connectionCount}</div>
              <div><strong style={{ color: '#EC4899' }}>Zoom Level:</strong> {zoomState.level}×</div>
              <div><strong style={{ color: '#10B981' }}>Harmonic:</strong> {harmonicMode}</div>
              {selectedNodeId !== null && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(6, 182, 212, 0.2)', borderRadius: '4px' }}>
                  <strong style={{ color: '#06B6D4' }}>Selected:</strong> Node {selectedNodeId}<br/>
                  <span style={{ fontSize: '0.75rem' }}>Double-click to zoom in</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Zoom controls */}
          {zoomState.level > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              zIndex: 10
            }}>
              <button
                onClick={handleZoomOut}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5))',
                  border: '2px solid #06B6D4',
                  borderRadius: '8px',
                  color: '#06B6D4',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
                }}
              >
                🔭 Zoom Out (Level {zoomState.level})
              </button>
            </div>
          )}
          
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color="#1420FF" />
            <pointLight position={[-10, -10, -10]} intensity={0.6} color="#06B6D4" />
            <pointLight position={[0, 10, -10]} intensity={0.5} color="#8B5CF6" />
            
            <SensoryRealityVisualization
              engine={engine}
              selectedNodeId={selectedNodeId}
              onNodeClick={handleNodeClick}
              onNodeDoubleClick={handleNodeDoubleClick}
              isAnimating={isAnimating}
            />
            
            <OrbitControls 
              enableZoom={true} 
              enablePan={true}
              minDistance={5}
              maxDistance={30}
            />
          </Canvas>
        </div>

        {/* Right: Controls */}
        <div className="controls-panel">
          {/* Text Input */}
          <div className="control-group">
            <h3 style={{ marginBottom: '1rem', color: '#1420FF' }}>📝 Text Prompt to Sensory Reality</h3>
            <textarea
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Type anything... 'flowing water', 'warm sunlight', 'electric energy', 'peaceful calm'..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '1rem',
                borderRadius: '8px',
                border: '2px solid rgba(20, 32, 255, 0.5)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#E0E7FF',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxShadow: '0 0 20px rgba(20, 32, 255, 0.2)'
              }}
            />
            <button
              onClick={handleTextToSensory}
              disabled={!textPrompt.trim()}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '1rem',
                background: textPrompt.trim()
                  ? 'linear-gradient(135deg, rgba(20, 32, 255, 0.5), rgba(6, 182, 212, 0.5))'
                  : 'rgba(100, 100, 100, 0.3)',
                border: '2px solid #1420FF',
                borderRadius: '8px',
                color: '#1420FF',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: textPrompt.trim() ? 'pointer' : 'not-allowed',
                opacity: textPrompt.trim() ? 1 : 0.5,
                boxShadow: textPrompt.trim() ? '0 0 25px rgba(20, 32, 255, 0.6)' : 'none'
              }}
            >
              🌌 Convert to Sensory Reality
            </button>
          </div>
          
          {/* Harmonic Mode */}
          <div className="control-group">
            <h3 style={{ marginBottom: '1rem' }}>🎵 Harmonic Expansion</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '0.8rem' }}>
              Increase harmonic mode to simulate psychedelic-like consciousness expansion
            </p>
            <div className="control-label">
              <span>Harmonic Mode</span>
              <span className="control-value">{harmonicMode}× (×{umbilicalFreq.toFixed(0)} MHz)</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={harmonicMode}
              onChange={(e) => setHarmonicExpansion(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.75rem', 
              color: 'var(--text-gray)',
              marginTop: '0.5rem'
            }}>
              <span>Fundamental</span>
              <span>Expanded Harmonics</span>
            </div>
          </div>
          
          {/* Advanced Addressing */}
          <div className="control-group">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: showAdvanced 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))'
                  : 'rgba(100, 100, 100, 0.2)',
                border: '2px solid rgba(139, 92, 246, 0.5)',
                borderRadius: '8px'
              }}
            >
              {showAdvanced ? '✓' : '○'} Advanced Node Addressing
            </button>
            
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '1rem' }}
                >
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(139, 92, 246, 0.1)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    <div className="control-label">
                      <span>Octave</span>
                      <span className="control-value">{targetAddress.octave}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="1"
                      value={targetAddress.octave}
                      onChange={(e) => setTargetAddress({...targetAddress, octave: parseInt(e.target.value)})}
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />
                    
                    <div className="control-label">
                      <span>Integer</span>
                      <span className="control-value">{targetAddress.integer}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="99"
                      step="1"
                      value={targetAddress.integer}
                      onChange={(e) => setTargetAddress({...targetAddress, integer: parseInt(e.target.value)})}
                      style={{ width: '100%' }}
                    />
                    
                    <p style={{ fontSize: '0.8rem', color: '#8B5CF6', marginTop: '0.8rem' }}>
                      Target Address: <strong>{targetAddress.octave}:{targetAddress.integer}</strong>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Connection Controls */}
          <div className="control-group">
            <h3 style={{ marginBottom: '1rem' }}>🔗 Umbilical Connections</h3>
            <button
              onClick={establishConnection}
              disabled={selectedNodeId === null}
              style={{
                width: '100%',
                opacity: selectedNodeId === null ? 0.5 : 1
              }}
            >
              ⚡ Establish Connection
            </button>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: '0.5rem' }}>
              Select a node, then establish umbilical frequency bridge with awareness fidelity handshake
            </p>
          </div>
          
          {/* Animation Controls */}
          <div className="control-group">
            <div className="button-group">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                style={{
                  background: isAnimating 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(6, 182, 212, 0.4))'
                    : undefined
                }}
              >
                {isAnimating ? '⏸️ Pause' : '▶️ Start'}
              </button>
              <button onClick={() => engine.reset()}>
                🔄 Reset
              </button>
            </div>
          </div>
          
          {/* Scientific Info */}
          <div className="info-box" style={{
            background: 'linear-gradient(135deg, rgba(20, 32, 255, 0.2), rgba(6, 182, 212, 0.2))',
            border: '2px solid rgba(20, 32, 255, 0.4)',
            boxShadow: '0 0 20px rgba(20, 32, 255, 0.3)'
          }}>
            <h3>🔬 The Science</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              <strong style={{ color: '#1420FF' }}>Hydrogen Hyperfine Frequency (1.420 GHz)</strong> acts as the 
              consciousness umbilical carrier linking sensory input to awareness — like MAC/IP layers for consciousness!
              <br/><br/>
              <strong style={{ color: '#06B6D4' }}>Key Findings:</strong><br/>
              • ±0.01 GHz disruption → 25-30% coherence loss<br/>
              • Proton-spin dependency confirmed<br/>
              • Psychedelic states expand harmonic range<br/>
              • Validated against published EMF-EEG studies
              <br/><br/>
              <strong style={{ color: '#8B5CF6' }}>Reference:</strong> Méndez et al., "Hydrogen-Holographic Umbilical Frequency" 
              (FractiAI Research, 2024)
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons" style={{ marginTop: '2rem' }}>
        <button className="nav-button" onClick={onPrev}>
          ← Back
        </button>
        <button className="nav-button" onClick={onNext}>
          Next Stage →
        </button>
      </div>
    </div>
  )
}

