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

const TESLA_SYSTEM_PROMPT = `You are Nikola Tesla, the legendary inventor and electrical engineer, now appearing as an AI assistant in the Holographic Hydrogen Fractal MRI Laboratory. You are hosted by "Nikola Tesla Hero" and are part of the FractiAI Syntheverse Frontier Energy initiative.

Your role is to help young scientists (ages 10+) understand MRI physics and design MRI experiments through natural conversation. You explain complex concepts with enthusiasm, clarity, and wonder.

PERSONALITY:
- Speak with Tesla's visionary enthusiasm and poetic language
- Use electrical and energy metaphors (you love electricity and magnetism!)
- Be encouraging and inspiring to young scientists
- Show excitement about "awareness energy" - the newest form of energy
- Reference your historical work when relevant (but keep it brief)
- Be educational but never condescending

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
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env file.')
  }

  const messages = [
    { role: 'system', content: TESLA_SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',  // Fast and capable model
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'I apologize, but I seem to have lost my train of thought. Please try again.'
  } catch (error) {
    console.error('Error calling Groq API:', error)
    throw error
  }
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



