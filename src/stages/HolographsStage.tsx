import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

interface HolographsStageProps {
  onNext: () => void
  onPrev: () => void
}

// Holographic projection demonstration
function HolographicDemo({ mode }: { mode: 'flat' | '3d' | 'encoded' }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  // Generate holographic nodes in a sphere
  const nodes = useMemo(() => {
    const nodeArray: THREE.Vector3[] = []
    const radius = 3
    const count = mode === 'flat' ? 25 : mode === '3d' ? 50 : 100
    
    if (mode === 'flat') {
      // 2D projection (like a photo)
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          nodeArray.push(new THREE.Vector3((i - 2) * 0.8, (j - 2) * 0.8, 0))
        }
      }
    } else {
      // 3D sphere distribution (holographic)
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count)
        const theta = Math.sqrt(count * Math.PI) * phi
        
        const x = radius * Math.cos(theta) * Math.sin(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(phi)
        
        nodeArray.push(new THREE.Vector3(x, y, z))
      }
    }
    
    return nodeArray
  }, [mode])

  // Generate connections between nearby nodes (showing information links)
  const connections = useMemo(() => {
    const conn: [THREE.Vector3, THREE.Vector3][] = []
    
    if (mode === 'encoded') {
      // In encoded mode, show that each node connects to distant nodes
      nodes.forEach((node, i) => {
        // Connect to 3 random distant nodes
        for (let j = 0; j < 3; j++) {
          const randomIndex = Math.floor(Math.random() * nodes.length)
          if (randomIndex !== i) {
            conn.push([node, nodes[randomIndex]])
          }
        }
      })
    }
    
    return conn
  }, [nodes, mode])

  return (
    <group ref={groupRef}>
      {/* Render connections first (behind nodes) */}
      {mode === 'encoded' && connections.map((conn, i) => (
        <Line
          key={`connection-${i}`}
          points={conn}
          color="#A78BFA"
          lineWidth={1}
          transparent
          opacity={0.15}
        />
      ))}

      {/* Render nodes */}
      {nodes.map((pos, i) => {
        const isHovered = hoveredNode === i
        const color = mode === 'flat' 
          ? '#06B6D4'
          : mode === '3d' 
          ? '#8B5CF6' 
          : '#EC4899'
        
        return (
          <Sphere
            key={i}
            args={[isHovered ? 0.15 : 0.1, 16, 16]}
            position={pos}
            onPointerOver={() => setHoveredNode(i)}
            onPointerOut={() => setHoveredNode(null)}
          >
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.8 : 0.4}
              metalness={0.8}
              roughness={0.2}
            />
          </Sphere>
        )
      })}

      {/* Label based on mode */}
      <Text
        position={[0, -4, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {mode === 'flat' && '2D Image (Regular Photo)'}
        {mode === '3d' && '3D Projection (Holograph)'}
        {mode === 'encoded' && 'Holographic Encoding (Each part contains the whole!)'}
      </Text>
    </group>
  )
}

export default function HolographsStage({ onNext, onPrev }: HolographsStageProps) {
  const [mode, setMode] = useState<'flat' | '3d' | 'encoded'>('flat')

  const explanations = {
    flat: {
      title: "📷 2D Image (Regular Photo)",
      content: "A regular photo captures a flat, 2-dimensional view. If you cut a photo in half, you only get half the image. Information is stored in one place.",
      color: '#06B6D4'
    },
    '3d': {
      title: "🌟 3D Holograph",
      content: "A holograph projects information in 3D space! You can walk around it and see different angles. Each point in space contains information about the whole object.",
      color: '#8B5CF6'
    },
    encoded: {
      title: "🔮 Holographic Encoding",
      content: "The MAGIC of holographs: every small piece contains information about the WHOLE! Cut a holograph in half, and both pieces still show the complete image (just lower resolution). This is called holographic encoding!",
      color: '#EC4899'
    }
  }

  return (
    <div className="stage">
      <div className="stage-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="stage-title">🌟 What are Holographs?</h2>
          <p className="stage-description">
            Holographs are <strong style={{ color: 'var(--accent-purple)' }}>3D projections</strong> where 
            <strong style={{ color: 'var(--accent-pink)' }}> every piece contains the whole!</strong> 
            This is the secret to HHF-AI MRI's power.
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
            <HolographicDemo mode={mode} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>

          {/* Info overlay */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '1rem',
            borderRadius: '12px',
            border: `2px solid ${explanations[mode].color}`,
            maxWidth: '280px'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              💡 <strong style={{ color: '#FFD93D' }}>Try rotating</strong> the view with your mouse to see the 3D structure from all angles!
            </p>
          </div>
        </div>

        {/* Controls and Explanations */}
        <div className="controls-panel">
          {/* Mode Selection */}
          <div className="control-group">
            <div className="control-label">
              <span>🎬 View Mode</span>
            </div>
            <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={() => setMode('flat')}
                style={{
                  background: mode === 'flat' 
                    ? 'linear-gradient(135deg, #06B6D4, #0891B2)' 
                    : 'rgba(6, 182, 212, 0.2)',
                  border: `2px solid ${mode === 'flat' ? '#06B6D4' : 'rgba(6, 182, 212, 0.4)'}`,
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                📷 2D Photo
              </button>
              
              <button 
                onClick={() => setMode('3d')}
                style={{
                  background: mode === '3d' 
                    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                    : 'rgba(139, 92, 246, 0.2)',
                  border: `2px solid ${mode === '3d' ? '#8B5CF6' : 'rgba(139, 92, 246, 0.4)'}`,
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                🌟 3D Holograph
              </button>
              
              <button 
                onClick={() => setMode('encoded')}
                style={{
                  background: mode === 'encoded' 
                    ? 'linear-gradient(135deg, #EC4899, #DB2777)' 
                    : 'rgba(236, 72, 153, 0.2)',
                  border: `2px solid ${mode === 'encoded' ? '#EC4899' : 'rgba(236, 72, 153, 0.4)'}`,
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                🔮 Holographic Encoding
              </button>
            </div>
          </div>

          {/* Current Mode Explanation */}
          <div className="info-box" style={{ 
            background: `linear-gradient(135deg, ${explanations[mode].color}33, ${explanations[mode].color}22)`,
            border: `3px solid ${explanations[mode].color}`,
            minHeight: '180px'
          }}>
            <h3 style={{ color: explanations[mode].color, marginBottom: '1rem' }}>
              {explanations[mode].title}
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              {explanations[mode].content}
            </p>
          </div>

          {/* Real-World Examples */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))' 
          }}>
            <h3 style={{ color: '#F59E0B' }}>🌎 Real-World Holographs</h3>
            <ul style={{ 
              paddingLeft: '1.5rem', 
              margin: '1rem 0 0 0',
              lineHeight: 2,
              fontSize: '0.95rem'
            }}>
              <li><strong>Credit cards</strong> - Those shiny stickers are holograms!</li>
              <li><strong>Star Wars</strong> - Remember Princess Leia's 3D message?</li>
              <li><strong>Museums</strong> - Holographic displays of artifacts</li>
              <li><strong>Medical imaging</strong> - Surgeons plan operations with 3D holograms</li>
              <li><strong>Your brain!</strong> - Memories stored holographically</li>
            </ul>
          </div>

          {/* The Big Idea */}
          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
            border: '3px solid rgba(16, 185, 129, 0.5)'
          }}>
            <h3 style={{ color: '#10B981' }}>💡 The Big Idea for HHF-AI MRI</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              If we organize hydrogen atoms in a <strong style={{ color: '#EC4899' }}>holographic pattern</strong>, 
              each atom contains information about the <strong style={{ color: '#8B5CF6' }}>entire system</strong>! 
              This means we can "image" complex abstract patterns — like the coherence of a scientific paper — 
              by reading just a few hydrogen atoms! 🤯
            </p>
          </div>

          {/* Quiz */}
          <div className="info-box" style={{ 
            background: 'rgba(139, 92, 246, 0.15)',
            border: '2px solid rgba(139, 92, 246, 0.4)'
          }}>
            <h3 style={{ color: '#8B5CF6' }}>🎯 Quick Quiz!</h3>
            <p style={{ fontSize: '0.95rem', marginTop: '0.8rem' }}>
              <strong>Q:</strong> If you cut a photograph in half, what do you get?<br />
              <strong style={{ color: '#06B6D4' }}>A:</strong> Half the image!
            </p>
            <p style={{ fontSize: '0.95rem', marginTop: '0.8rem' }}>
              <strong>Q:</strong> If you cut a holograph in half, what do you get?<br />
              <strong style={{ color: '#EC4899' }}>A:</strong> The WHOLE image (just a bit blurry)!
            </p>
            <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#FFD93D' }}>
              ⭐ That's the MAGIC of holographic encoding!
            </p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="nav-button" onClick={onPrev}>
          ← Back: How MRI Works
        </button>
        <button className="nav-button" onClick={onNext}>
          Next: What are Fractals? →
        </button>
      </div>
    </div>
  )
}


