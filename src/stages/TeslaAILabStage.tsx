import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text } from '@react-three/drei'
import { useState, useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BlochSimulator, 
  DEFAULT_MRI_PARAMS,
  magnetizationToColor,
  type SpinState 
} from '../utils/BlochSimulator'
import { 
  chatWithTesla, 
  parseMRIConfig, 
  extractExplanation,
  type MRIExperimentConfig 
} from '../utils/groqClient'

interface TeslaAILabStageProps {
  onNext: () => void
  onPrev: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

function TeslaAvatar({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      
      // Speaking animation - pulse when active
      if (isSpeaking) {
        const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.1 + 1
        groupRef.current.scale.setScalar(pulse)
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Tesla's "electric aura" */}
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#8B5CF6"
          emissiveIntensity={isSpeaking ? 0.8 : 0.3}
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Core sphere */}
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#EC4899"
          emissiveIntensity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Tesla's symbol */}
      <Text
        position={[0, 0, 0.9]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        ⚡
      </Text>
      
      {/* Electric rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={isSpeaking ? 1 : 0.5}
        />
      </mesh>
      
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.4, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={isSpeaking ? 1 : 0.5}
        />
      </mesh>
    </group>
  )
}

function ExperimentVisualization({ 
  simulator,
  isRunning 
}: { 
  simulator: BlochSimulator
  isRunning: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [spinStates, setSpinStates] = useState<SpinState[]>([])
  
  useFrame((state, delta) => {
    if (isRunning && simulator) {
      simulator.evolve(delta * 1000)
      setSpinStates(simulator.getAllSpinStates())
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  const spinPositions = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const gridSize = 4
    const spacing = 1.2
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          positions.push(new THREE.Vector3(
            (x - gridSize / 2) * spacing,
            (y - gridSize / 2) * spacing - 2,
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
        const color = magnetizationToColor(state)
        const mag = Math.sqrt(state.Mx ** 2 + state.My ** 2 + state.Mz ** 2)
        
        return (
          <Sphere key={i} args={[0.15 * mag, 16, 16]} position={pos}>
            <meshStandardMaterial
              color={new THREE.Color(color.r, color.g, color.b)}
              emissive={new THREE.Color(color.r * 0.5, color.g * 0.5, color.b * 0.5)}
              emissiveIntensity={0.7}
              metalness={0.8}
              roughness={0.2}
            />
          </Sphere>
        )
      })}
    </group>
  )
}

export default function TeslaAILabStage({ onNext, onPrev }: TeslaAILabStageProps) {
  const [simulator] = useState(() => new BlochSimulator(DEFAULT_MRI_PARAMS, 64))
  const [isRunning, setIsRunning] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Greetings, young scientist! I am Nikola Tesla, speaking to you through the electromagnetic fabric of reality itself! Welcome to my Holographic Hydrogen Fractal MRI Laboratory. Here, we shall explore the newest energy - Awareness Energy - through the marriage of magnetic resonance and artificial intelligence. Tell me, what experiment shall we conduct today?',
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<MRIExperimentConfig | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, newUserMessage])
    
    setIsLoading(true)
    setIsSpeaking(true)

    try {
      // Get conversation history
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      
      // Call Tesla AI
      const response = await chatWithTesla(userMessage, history)
      
      // Parse for MRI config
      const config = parseMRIConfig(response)
      const explanation = extractExplanation(response)
      
      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: explanation,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, assistantMessage])
      
      // If we got a valid config, apply it
      if (config) {
        setCurrentConfig(config)
        simulator.updateParameters({
          B0: config.B0,
          T1: config.T1,
          T2: config.T2,
          M0: 1.0,
          gamma: 42.58
        })
        simulator.reset()
        
        // Apply the pulse
        simulator.applyRFPulse({
          flipAngle: config.flipAngle,
          phase: 0,
          duration: 1
        })
        
        setIsRunning(true)
      }
      
    } catch (error) {
      console.error('Error communicating with Tesla:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'My apologies! The electromagnetic interference is disrupting our connection. Please try again, or check that the Groq API key is properly configured.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsSpeaking(false), 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const examplePrompts = [
    "Show me water at 7 Tesla",
    "What happens with a 180° pulse?",
    "Simulate brain gray matter",
    "Show me fat tissue",
    "Create a fast gradient echo",
    "Demonstrate T1 relaxation"
  ]

  return (
    <div className="stage">
      <div className="stage-header">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="stage-title" style={{ 
            background: 'linear-gradient(135deg, #F59E0B, #EC4899, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚡ Ask Tesla Anything
          </h2>
          <p className="subtitle" style={{ 
            color: 'var(--accent-orange)', 
            fontWeight: 600,
            fontSize: '1.1rem',
            marginTop: '0.5rem'
          }}>
            Hosted by Nikola Tesla Hero | HHF-AI MRI Lab
          </p>
        </motion.div>
        <p className="stage-description" style={{ marginTop: '1rem' }}>
          Chat with AI Nikola Tesla to design and run real MRI experiments! 
          Describe what you want to see, and Tesla will configure the simulator for you.
        </p>
      </div>

      <div className="content-grid">
        <div className="visualization-panel" style={{ minHeight: '600px', position: 'relative' }}>
          <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8B5CF6" />
            <pointLight position={[0, 10, 0]} intensity={1} color="#F59E0B" />
            
            <TeslaAvatar isSpeaking={isSpeaking} />
            <ExperimentVisualization simulator={simulator} isRunning={isRunning} />
            
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
          
          {currentConfig && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid var(--accent-orange)',
              borderRadius: '12px',
              padding: '1rem',
              minWidth: '200px'
            }}>
              <h4 style={{ color: 'var(--accent-orange)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                ⚡ Active Experiment
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                <div><strong>B₀:</strong> {currentConfig.B0}T</div>
                <div><strong>T1:</strong> {currentConfig.T1}ms</div>
                <div><strong>T2:</strong> {currentConfig.T2}ms</div>
                <div><strong>Flip:</strong> {currentConfig.flipAngle}°</div>
                {currentConfig.pulseSequence && (
                  <div><strong>Seq:</strong> {currentConfig.pulseSequence}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="controls-panel">
          {/* Chat Interface */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid var(--accent-orange)',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            height: '500px'
          }}>
            <h3 style={{ 
              color: 'var(--accent-orange)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚡ Talk to Tesla
              {isSpeaking && (
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>
                  ● Speaking...
                </span>
              )}
            </h3>
            
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '8px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))'
                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
                      border: msg.role === 'user'
                        ? '1px solid var(--primary-blue)'
                        : '1px solid var(--accent-orange)',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%'
                    }}
                  >
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-gray)',
                      marginBottom: '0.3rem',
                      fontWeight: 600
                    }}>
                      {msg.role === 'user' ? '👤 You' : '⚡ Tesla'}
                    </div>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
                    border: '1px solid var(--accent-orange)',
                    alignSelf: 'flex-start'
                  }}
                >
                  <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Tesla to run an experiment..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '2px solid var(--primary-cyan)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{ minWidth: '80px' }}
              >
                {isLoading ? '...' : 'Send ⚡'}
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="control-group">
            <div className="control-label">
              <span>💡 Try These Experiments</span>
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              marginTop: '0.8rem'
            }}>
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  disabled={isLoading}
                  style={{
                    padding: '0.6rem',
                    fontSize: '0.8rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid var(--primary-purple)'
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="info-box" style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
            border: '2px solid var(--accent-orange)'
          }}>
            <h3>⚡ About Tesla Hero AI</h3>
            <p>
              This AI assistant is powered by <strong>Groq</strong> and embodies Nikola Tesla's 
              spirit of discovery! Ask in natural language and Tesla will translate your ideas 
              into precise MRI experiments. The simulator then executes real Bloch equations 
              to show you the results!
            </p>
          </div>

          <div className="control-group">
            <div className="button-group">
              <button 
                onClick={() => setIsRunning(!isRunning)}
                style={{ flex: 1 }}
              >
                {isRunning ? '⏸️ Pause' : '▶️ Resume'}
              </button>
              <button 
                onClick={() => {
                  simulator.reset()
                  setIsRunning(false)
                }}
                style={{ flex: 1 }}
              >
                🔄 Reset
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
          Next: Seeds & Edges →
        </button>
      </div>
    </div>
  )
}



