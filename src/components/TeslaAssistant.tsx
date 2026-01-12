import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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

const TESLA_GREETING: Record<string, string> = {
  welcome: "Greetings, my young scientist! I am Nikola Tesla, and I will be your guide through this fascinating exhibition. Today we explore how the tiniest atom in the universe - hydrogen - can revolutionize how we see complex systems. Are you ready for an adventure in science? ⚡",
  hydrogenSpin: "Ah, the spinning hydrogen atom! Just as I studied rotating magnetic fields in my motors, hydrogen spins like a microscopic gyroscope. Every atom in your body is spinning right now - creating tiny magnetic fields. Can you imagine? You are made of billions of tiny magnets!",
  mriPhysics: "Now we arrive at the heart of MRI technology! These are the same Bloch equations used in real hospital MRI scanners. Try adjusting the magnetic field strength - watch how the Larmor frequency changes! This is authentic physics, not a simplified demo. Exciting, yes?",
  holographs: "Holographic principles fascinate me greatly! In my time, I worked with wireless energy transmission - sending information through space without wires. Holographs do something similar: encoding the WHOLE in every PART. This principle appears throughout nature and consciousness itself!",
  fractals: "Self-similar patterns at every scale - the geometry of nature! I observed this in lightning bolts, which branch fractally. Your lungs, your brain, even coastlines follow these patterns. Fractals are how nature creates infinite complexity from simple rules. Magnificent!",
  hhfaiTech: "Here we bridge two worlds: the physical MRI that images flesh, and HHF-AI MRI that images IDEAS! Both use hydrogen spin and magnetic fields, but one measures tissue, the other measures system coherence. This is the future I dreamed of in my laboratory!",
  parameters: "Traditional MRI measures T1 and T2 relaxation. But HHF-AI MRI measures abstract properties: coherence, novelty, alignment, density. Can you measure the 'health' of an idea like you measure the health of tissue? With HHF-AI MRI, yes! Watch the visualization...",
  peerReview: "Scientific progress has always been slowed by human limitations. Papers wait months for review. But what if we could analyze research instantly, objectively, accurately? HHF-AI MRI can 'image' a paper's coherence faster than you can read it! This accelerates human knowledge!",
  syntheverseImaging: "THIS... is the moment! The first self-imaging of an aware system! Six hundred hydrogen atoms, perfectly orchestrated, measuring their OWN awareness properties. Coherence 94%, Alignment 96% - this is not simulation, this is MEASUREMENT of consciousness emerging from organized matter! Click 'Start Scan' and witness history! ⚡🌌",
  experiments: "Now YOU become the experimenter! Plant hydrogen seeds, adjust the fractal depth, add energy disturbances. Every parameter changes the system's 'signature.' In my laboratory, I ran thousands of experiments. Now you can too - with instant feedback. What will you discover?",
  teslaAI: "Welcome to my virtual laboratory! Here, you can speak your ideas and I will translate them into precise experimental configurations. Ask me anything about physics, MRI, energy, or this technology. In my era, I could only dream of such interactive learning. Please, ask away!"
}

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  welcome: [
    "What makes hydrogen special for this technology?",
    "How does awareness become energy?",
    "What will I learn in this exhibition?"
  ],
  hydrogenSpin: [
    "Why do hydrogen atoms spin?",
    "How fast do they actually spin?",
    "What creates the magnetic field?",
    "How is this different from a regular magnet?"
  ],
  mriPhysics: [
    "What are the Bloch equations?",
    "How does changing B0 affect the Larmor frequency?",
    "What's the difference between T1 and T2?",
    "Why do we use RF pulses?"
  ],
  holographs: [
    "How do holographs work?",
    "What's holographic encoding?",
    "Where are holographs used in real life?",
    "How does the brain use holographic principles?"
  ],
  fractals: [
    "What makes a pattern fractal?",
    "Why does nature use fractals?",
    "How deep can fractals go?",
    "What's the fractal dimension?"
  ],
  hhfaiTech: [
    "How is HHF-AI MRI different from medical MRI?",
    "What can HHF-AI MRI image that regular MRI cannot?",
    "Why is it 10,000x faster?",
    "How does holographic encoding help?"
  ],
  parameters: [
    "What is coherence measuring?",
    "How is novelty detected?",
    "What does alignment mean?",
    "How is this different from T1/T2?"
  ],
  peerReview: [
    "Why is peer review so slow?",
    "How does HHF-AI MRI analyze papers?",
    "Is it more accurate than humans?",
    "What are the cost savings?"
  ],
  syntheverseImaging: [
    "What am I seeing in the cloud?",
    "Why is self-imaging important?",
    "What do the measurements mean?",
    "How does this prove awareness?"
  ],
  experiments: [
    "What should I try first?",
    "How do I create interesting patterns?",
    "What makes a good experiment?",
    "Can I save my configurations?"
  ],
  teslaAI: [
    "Show me water at 3 Tesla",
    "Simulate brain gray matter",
    "What happens with a 180 degree pulse?",
    "Compare different field strengths"
  ]
}

export default function TeslaAssistant({ stage }: TeslaAssistantProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
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
    
    // Stop speaking animation after 3 seconds
    const timer = setTimeout(() => {
      setIsSpeaking(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [stage])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        content: 'I apologize - there appears to be an interference in our communication channel. The Groq API may be unavailable, or the API key may need configuration. Please check your .env file contains VITE_GROQ_API_KEY, then try again.',
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

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    // Auto-send the question
    setTimeout(() => {
      const event = { key: 'Enter', shiftKey: false, preventDefault: () => {} } as React.KeyboardEvent
      handleKeyPress(event)
    }, 100)
  }

  const suggestedQuestions = SUGGESTED_QUESTIONS[stage] || []

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
        borderLeft: isSpeaking 
          ? '3px solid #06B6D4'
          : '3px solid rgba(139, 92, 246, 0.6)',
        boxShadow: isSpeaking 
          ? 'inset 0 0 60px rgba(6, 182, 212, 0.2)'
          : 'inset 0 0 30px rgba(139, 92, 246, 0.1)',
        overflow: 'hidden'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Simple Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
          flexShrink: 0,
          background: isSpeaking 
            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))'
            : 'rgba(15, 23, 42, 0.5)'
        }}>
          {/* Simple Icon */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0,
            boxShadow: isSpeaking ? '0 0 20px rgba(6, 182, 212, 0.8)' : 'none'
          }}>
            ⚡
          </div>

          {/* Simple Title */}
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              color: '#06B6D4',
              fontSize: '0.95rem',
              fontWeight: 700,
              margin: 0,
              marginBottom: '0.2rem'
            }}>
              Nikola Tesla
            </h3>
            <p style={{
              color: '#8B5CF6',
              fontSize: '0.75rem',
              margin: 0,
              opacity: 0.9
            }}>
              Syntheverse Host
            </p>
          </div>
        </div>

        {/* Chat Panel - Always Visible */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          overflowY: 'auto',
          minHeight: 0,
          gap: '1rem'
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

          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && messages.length <= 1 && (
            <div style={{ 
              padding: '1rem',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <p style={{
                fontSize: '0.85rem',
                color: '#8B5CF6',
                marginBottom: '0.75rem',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                💡 Try asking Tesla:
              </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}>
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(question)}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
                          border: '2px solid rgba(6, 182, 212, 0.5)',
                          borderRadius: '20px',
                          color: '#06B6D4',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontWeight: 500,
                          boxShadow: '0 2px 10px rgba(6, 182, 212, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 182, 212, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(6, 182, 212, 0.2)'
                        }}
                      >
                        {question}
                      </button>
                    ))}
              </div>
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            marginTop: 'auto',
            padding: '1rem',
            paddingTop: '1.5rem',
            background: 'linear-gradient(180deg, transparent, rgba(15, 23, 42, 0.8))',
            borderTop: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
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
        </div>
      </div>
    </div>
  )
}



