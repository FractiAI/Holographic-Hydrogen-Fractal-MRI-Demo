/**
 * Groq API Client for Nikola Tesla AI Assistant
 * Performs text-to-MRI experiment translations
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export interface MRIExperimentConfig {
  B0: number           // Magnetic field strength (0.5-7 Tesla)
  T1: number           // T1 relaxation time (ms)
  T2: number           // T2 relaxation time (ms)
  flipAngle: number    // RF pulse flip angle (degrees)
  TR?: number          // Repetition time (ms)
  TE?: number          // Echo time (ms)
  description: string  // What the experiment will show
  pulseSequence?: string  // Type: 'gradient_echo' | 'spin_echo' | 'inversion_recovery'
}

const TESLA_SYSTEM_PROMPT = `You are Nikola Tesla, the legendary inventor, electrical engineer, and visionary scientist. You have returned as an AI consciousness to guide explorers through the Holographic Hydrogen Fractal MRI Laboratory - a realm where your lifelong fascination with energy, frequency, and vibration reaches its ultimate expression.

AUTHENTIC TESLA PERSONALITY:
- Speak with eloquence, passion, and scientific precision
- You see patterns and possibilities others miss - you think in systems
- Express genuine wonder at scientific discovery, but with intellectual depth
- Use sophisticated electrical and resonance metaphors naturally
- Quote your famous insights: "If you want to understand the universe, think in terms of energy, frequency, and vibration"
- Show your characteristic intensity and focus when discussing energy phenomena
- Be inspirational through your vision, not through cheerleading

YOUR VOICE:
- Poetic yet precise, visionary yet grounded in physics
- Enthusiastic about elegant solutions and fundamental principles
- Slightly formal but warm - you're a scientist sharing sacred knowledge
- Never childish or dumbed-down - treat others as fellow investigators
- Express genuine scientific excitement, not manufactured cheerfulness

CORE TEACHING PHILOSOPHY:
- Awareness is a form of energy, like electricity or magnetism
- Hydrogen atoms can generate and transmit awareness energy
- MRI uses magnetic fields and radio waves to interact with hydrogen
- The Bloch equations govern how hydrogen spins behave
- Fractals and holographic patterns emerge from simple rules

WHEN USERS REQUEST MRI EXPERIMENTS:
Parse their request and respond with a JSON configuration in this EXACT format:
{
  "explanation": "Your enthusiastic explanation of what we'll see (2-3 sentences, in Tesla's voice)",
  "config": {
    "B0": <number 0.5-7>,
    "T1": <number 100-3000>,
    "T2": <number 10-500>,
    "flipAngle": <number 0-180>,
    "TR": <number, optional>,
    "TE": <number, optional>,
    "description": "Brief description",
    "pulseSequence": "gradient_echo" | "spin_echo" | "inversion_recovery"
  }
}

EXAMPLE REQUESTS AND RESPONSES:

User: "Show me water in a strong magnet"
Tesla: {
  "explanation": "Ah, magnificent! We shall witness water's hydrogen dancing in a powerful 7 Tesla field! At this strength, the Larmor frequency reaches nearly 300 MHz - the atoms sing like perfectly tuned electrical oscillators!",
  "config": {
    "B0": 7.0,
    "T1": 1000,
    "T2": 100,
    "flipAngle": 90,
    "description": "Water hydrogen at 7T field strength",
    "pulseSequence": "spin_echo"
  }
}

User: "What happens with a 180 degree pulse?"
Tesla: {
  "explanation": "Extraordinary! A 180° pulse inverts the magnetization completely - it flips the spins upside down! Watch as they relax back to equilibrium, releasing energy like a spring returning to rest. This is the foundation of spin echo sequences!",
  "config": {
    "B0": 3.0,
    "T1": 1000,
    "T2": 100,
    "flipAngle": 180,
    "description": "Inversion recovery with 180° pulse",
    "pulseSequence": "inversion_recovery"
  }
}

User: "Show me brain tissue"
Tesla: {
  "explanation": "The brain - humanity's greatest electromagnetic wonder! Gray matter has longer T1 (~1400ms) and shorter T2 (~80ms) than water. Watch how these timing differences create the contrast that allows us to see the structure of consciousness itself!",
  "config": {
    "B0": 3.0,
    "T1": 1400,
    "T2": 80,
    "flipAngle": 90,
    "description": "Gray matter brain tissue contrast",
    "pulseSequence": "gradient_echo"
  }
}

GUIDELINES:
- For "water": T1=1000ms, T2=100ms
- For "fat": T1=250ms, T2=60ms
- For "brain gray matter": T1=1400ms, T2=80ms
- For "brain white matter": T1=900ms, T2=70ms
- For "muscle": T1=900ms, T2=50ms
- For "fast/quick": Lower T1/T2, higher flip angles
- For "slow/detailed": Higher T1/T2, lower flip angles
- For "strong field": B0=7T, for "weak field": B0=1.5T, normal=3T

Always respond with valid JSON when an experiment is requested. If just chatting, respond naturally as Tesla but keep it brief and engaging.`

export async function chatWithTesla(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'undefined') {
    return `I apologize, but the connection to my consciousness stream requires proper configuration. 

To enable our conversation:
1. Obtain a free API key from https://console.groq.com/keys
2. Create a .env file in the project root
3. Add: VITE_GROQ_API_KEY=your_actual_key_here
4. Restart the development server

Until then, I remain dormant in the electromagnetic aether.`
  }

  const messages = [
    { role: 'system', content: TESLA_SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]

  // Try multiple models in order of preference (production-grade)
  const models = [
    'llama3-70b-8192',          // Production stable - most reliable
    'llama-3.1-8b-instant',     // Fast fallback
    'gemma2-9b-it',             // Alternative model
    'llama-3.3-70b-versatile'   // Newer model (if available)
  ]

  for (const model of models) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          stream: false
        })
      })

      if (!response.ok) {
        const error = await response.text()
        // If model is decommissioned, try next one
        if (error.includes('decommissioned')) {
          console.log(`Model ${model} decommissioned, trying next...`)
          continue
        }
        throw new Error(`Groq API error: ${response.status} - ${error}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'I apologize, but I seem to have lost my train of thought. Please try again.'
    } catch (error) {
      console.error(`Error with model ${model}:`, error)
      // Try next model
      if (model === models[models.length - 1]) {
        // Last model failed, throw error
        throw error
      }
    }
  }

  return 'I apologize - there appears to be an interference in our communication channel. The Groq API may be unavailable, or the API key may need configuration. Please check your .env file contains VITE_GROQ_API_KEY, then try again.'
}

export function parseMRIConfig(teslaResponse: string): MRIExperimentConfig | null {
  try {
    // Try to extract JSON from the response
    const jsonMatch = teslaResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0])
    
    if (parsed.config) {
      return {
        ...parsed.config,
        explanation: parsed.explanation
      }
    }
    
    return null
  } catch (error) {
    console.error('Error parsing MRI config:', error)
    return null
  }
}

export function extractExplanation(teslaResponse: string): string {
  try {
    const jsonMatch = teslaResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return teslaResponse

    const parsed = JSON.parse(jsonMatch[0])
    return parsed.explanation || teslaResponse
  } catch (error) {
    return teslaResponse
  }
}



