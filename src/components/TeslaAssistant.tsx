import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Text } from '@react-three/drei'
import * as THREE from 'three'
import { chatWithTesla } from '../utils/groqClient'

interface TeslaAssistantProps {
  stage: string
  isMinimized?: boolean
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

function TeslaAvatar3D({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      
      if (isSpeaking) {
        const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.15 + 1
        groupRef.current.scale.setScalar(pulse)
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer electric aura */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#8B5CF6"
          emissiveIntensity={isSpeaking ? 1 : 0.4}
          transparent
          opacity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Core */}
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#EC4899"
          emissiveIntensity={isSpeaking ? 1 : 0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Tesla symbol */}
      <Text
        position={[0, 0, 0.7]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        ⚡
      </Text>
      
      {/* Rotating rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={isSpeaking ? 1.5 : 0.6}
        />
      </mesh>
    </group>
  )
}

const TESLA_GREETING: Record<string, string> = {
  welcome: "Welcome, brilliant mind! I am Nikola Tesla. Ask me anything about awareness energy!",
  mriPhysics: "Greetings! You're exploring real MRI physics. What would you like to understand?",
  teslaAI: "You are in my full laboratory! Here you can design complete experiments.",
  seedEdge: "Energy propagation fascinates you? Ask me about seeds and edges!",
  boundaries: "Boundaries and coherence - fundamental to all systems. What puzzles you?",
  fractal: "Fractals! The universe's recursive beauty. What shall we explore?",
  grammar: "Symbols and states - the language of awareness. I'm here to explain!",
  finale: "The complete holographic field! What aspect intrigues you most?",
  experiments: "Experimentation time! Ask me to help design your exploration!"
}

export default function TeslaAssistant({ stage }: TeslaAssistantProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize with greeting when stage changes
  useEffect(() => {
    const greeting = TESLA_GREETING[stage] || "Nikola Tesla here. How may I illuminate your understanding?"
    setMessages([{
      role: 'assistant',
      content: greeting,
      timestamp: Date.now()
    }])
    setIsSpeaking(true)
    setTimeout(() => setIsSpeaking(false), 2000)
  }, [stage])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

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
      
      // Call Tesla AI with stage context
      const contextualQuery = `[Stage: ${stage}] ${userMessage}`
      const response = await chatWithTesla(contextualQuery, history)
      
      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, assistantMessage])
      
    } catch (error) {
      console.error('Error communicating with Tesla:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Apologies! The electromagnetic field is disrupted. Please try again.',
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{
        background: isSpeaking 
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.95), rgba(139, 92, 246, 0.95), rgba(236, 72, 153, 0.95))'
          : 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
        backdropFilter: 'blur(20px)',
        border: 'none',
        borderTop: isSpeaking 
          ? '4px solid #06B6D4'
          : '4px solid #8B5CF6',
        borderRadius: 0,
        boxShadow: isSpeaking 
          ? '0 -8px 60px rgba(6, 182, 212, 1), 0 -4px 40px rgba(139, 92, 246, 0.8), 0 0 100px rgba(236, 72, 153, 0.6), inset 0 2px 20px rgba(6, 182, 212, 0.4)'
          : '0 -4px 30px rgba(139, 92, 246, 0.6), 0 -2px 15px rgba(6, 182, 212, 0.4), inset 0 2px 10px rgba(139, 92, 246, 0.2)',
        transition: 'all 0.3s ease',
        height: isExpanded ? '400px' : '70px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Electric pulse effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #06B6D4, #8B5CF6, #EC4899, transparent)',
          animation: isSpeaking ? 'electricPulse 2s linear infinite' : 'none',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)'
        }}></div>
        {/* Header Bar - Always Visible */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.8rem 2rem',
          flexShrink: 0
        }}>
          {/* 3D Avatar */}
          <div style={{ 
            width: '50px', 
            height: '50px',
            flexShrink: 0
          }}>
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[2, 2, 2]} intensity={1} />
              <pointLight position={[-2, -2, -2]} intensity={0.5} color="#8B5CF6" />
              <TeslaAvatar3D isSpeaking={isSpeaking} />
            </Canvas>
          </div>

          {/* Tesla Header */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ 
              background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1rem',
              fontWeight: 700,
              textShadow: 'none',
              margin: 0,
              filter: isSpeaking ? 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' : 'none'
            }}>
              ⚡ Nikola Tesla AI Assistant
              <span style={{ 
                fontSize: '0.7rem',
                fontWeight: 400,
                background: isSpeaking 
                  ? 'linear-gradient(90deg, #F59E0B, #EC4899)'
                  : 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginLeft: '0.5rem'
              }}>
                {isExpanded ? '• Chat Active' : '• Click to chat'}
              </span>
            </h3>
            {!isExpanded && messages.length > 0 && (
              <p style={{
                color: '#06B6D4',
                fontSize: '0.85rem',
                margin: '0.2rem 0 0 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
              }}>
                {messages[messages.length - 1].content.slice(0, 80)}...
              </p>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '0.6rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))',
              border: '2px solid #06B6D4',
              borderRadius: '8px',
              color: '#06B6D4',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
              textShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5))'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.6), 0 0 50px rgba(139, 92, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.3)'
            }}
          >
            {isExpanded ? '▼ Minimize' : '▲ Chat with Tesla'}
          </button>
        </div>

        {/* Chat Panel - Expandable */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '0 2rem 1rem 2rem',
                overflow: 'hidden'
              }}
            >
              {/* Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: 'inset 0 2px 20px rgba(6, 182, 212, 0.1), 0 0 30px rgba(139, 92, 246, 0.2)'
              }}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '8px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4))'
                        : 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))',
                      border: msg.role === 'user'
                        ? '1px solid rgba(59, 130, 246, 0.6)'
                        : '1px solid rgba(6, 182, 212, 0.6)',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      boxShadow: msg.role === 'user'
                        ? '0 0 15px rgba(59, 130, 246, 0.3)'
                        : '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)'
                    }}
                  >
                    <div style={{ 
                      fontSize: '0.75rem', 
                      background: msg.role === 'user'
                        ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
                        : 'linear-gradient(90deg, #06B6D4, #8B5CF6, #EC4899)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '0.3rem',
                      fontWeight: 700
                    }}>
                      {msg.role === 'user' ? '👤 You' : '⚡ Tesla'}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      lineHeight: '1.5',
                      color: '#E0E7FF',
                      textShadow: msg.role === 'assistant' ? '0 0 5px rgba(6, 182, 212, 0.3)' : 'none'
                    }}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(236, 72, 153, 0.3))',
                      border: '1px solid rgba(245, 158, 11, 0.5)',
                      alignSelf: 'flex-start',
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}
                  >
                    <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                    <span style={{ color: 'white', fontSize: '0.9rem' }}>Tesla is thinking...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Tesla anything about awareness energy, MRI, or this stage..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    border: '2px solid rgba(6, 182, 212, 0.5)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#E0E7FF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.2), inset 0 2px 10px rgba(6, 182, 212, 0.1)'
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  style={{
                    padding: '0.8rem 2rem',
                    background: isLoading || !input.trim()
                      ? 'rgba(100, 100, 100, 0.3)'
                      : 'linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))',
                    border: '2px solid #06B6D4',
                    borderRadius: '8px',
                    color: '#06B6D4',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                    opacity: isLoading || !input.trim() ? 0.5 : 1,
                    transition: 'all 0.2s',
                    boxShadow: isLoading || !input.trim() 
                      ? 'none' 
                      : '0 0 20px rgba(6, 182, 212, 0.4)',
                    textShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.6), 0 0 50px rgba(139, 92, 246, 0.4)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && input.trim()) {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.4)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {isLoading ? '...' : 'Send ⚡'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}



