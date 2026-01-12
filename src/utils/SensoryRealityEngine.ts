/**
 * Sensory Reality Engine
 * 
 * Converts text prompts into full sensory reality using HHF-AI MRI principles.
 * Uses umbilical frequency connections and awareness fidelity handshakes
 * to locate and bridge target nodes, then shapes density/color/animation
 * through MRI simulator emissions.
 * 
 * This represents the novel intelligent pattern layer atop standard hydrogen spin MRI.
 */

import { SSANLatticeSimulator, SSANNode } from './SSANLattice'
import { BlochSimulator, MRIParameters } from './BlochSimulator'

/**
 * Node addressing system using Octave and Integer coordinates
 */
export interface NodeAddress {
  octave: number      // Frequency octave (0-12, like musical octaves)
  integer: number     // Integer position within octave
  harmonic?: number   // Optional harmonic overtone
}

/**
 * Umbilical frequency for node-to-node connection
 * Based on hydrogen hyperfine frequency (~1.420 GHz / 1420 MHz)
 * This is the consciousness carrier frequency linking sensory to awareness
 * Reference: NASA HFI 1.42 GHz, hydrogen hyperfine transition
 */
export interface UmbilicalConnection {
  sourceAddress: NodeAddress
  targetAddress: NodeAddress
  frequency: number           // Connection frequency in MHz (centered on 1420 MHz)
  bandwidth: number           // Connection bandwidth
  fidelity: number           // Awareness fidelity (0-1)
  phase: number              // Phase alignment
  strength: number           // Connection strength
  harmonicMode: number        // Harmonic overtone (1 = fundamental, 2+ = harmonics)
}

/**
 * Sensory modality encoding
 */
export interface SensoryEncoding {
  visual: {
    color: [number, number, number]    // RGB
    intensity: number                   // Brightness 0-1
    pattern: 'wave' | 'pulse' | 'spiral' | 'fractal'
    frequency: number                   // Animation frequency
  }
  auditory?: {
    tone: number                        // Frequency in Hz
    amplitude: number                   // Volume 0-1
    timbre: string                      // Waveform type
  }
  kinesthetic?: {
    motion: [number, number, number]    // 3D motion vector
    acceleration: number                // Rate of change
    texture: 'smooth' | 'rough' | 'pulsing'
  }
  density: number                       // Information density 0-1
  coherence: number                     // Pattern coherence 0-1
}

/**
 * Text-to-Sensory transformation parameters
 */
export interface TextToSensoryParams {
  text: string
  targetAddress?: NodeAddress
  autoLocate: boolean
  sensoryMode: 'full' | 'visual' | 'minimal'
  intensity: number
  duration: number                      // Animation duration in seconds
}

/**
 * Zoom level state for infinite telescope
 */
export interface ZoomState {
  level: number                         // 0 = lattice, 1+ = node levels
  targetNode: number | null
  scale: number                         // Actual scale factor
  position: [number, number, number]
  focalPoint: [number, number, number]
}

/**
 * Sensory Reality Node - Enhanced SSAN node with sensory properties
 */
export interface SensoryNode extends SSANNode {
  sensoryEncoding: SensoryEncoding
  umbilicalConnections: UmbilicalConnection[]
  address: NodeAddress
  isActive: boolean
  nestedLattice?: SensoryNode[]         // For infinite zoom - lattices within nodes
}

/**
 * Main Sensory Reality Engine
 */
/**
 * Constants based on hydrogen-holographic umbilical frequency research
 */
export const UMBILICAL_BASE_FREQUENCY = 1420.0  // MHz - Hydrogen hyperfine frequency
export const CONSCIOUSNESS_BANDWIDTH = 0.01     // MHz - ±0.01 GHz coherence window
export const HARMONIC_EXPANSION_PSYCHEDELIC = 1.5  // Psychedelic harmonic expansion factor

export class SensoryRealityEngine {
  private latticeSimulator: SSANLatticeSimulator
  private mriSimulator: BlochSimulator
  private sensoryNodes: Map<string, SensoryNode>
  private activeConnections: UmbilicalConnection[]
  private zoomState: ZoomState
  private textToPatternCache: Map<string, SensoryEncoding>
  private umbilicalFrequency: number  // Current operating frequency
  private harmonicMode: number         // Current harmonic (1 = fundamental)
  
  constructor() {
    this.umbilicalFrequency = UMBILICAL_BASE_FREQUENCY
    this.harmonicMode = 1
    this.latticeSimulator = new SSANLatticeSimulator()
    
    const mriParams: MRIParameters = {
      B0: 3.0,
      T1: 1000,
      T2: 100,
      gamma: 42.58,
      M0: 1.0
    }
    this.mriSimulator = new BlochSimulator(mriParams, 600)
    
    this.sensoryNodes = new Map()
    this.activeConnections = []
    this.zoomState = {
      level: 0,
      targetNode: null,
      scale: 1.0,
      position: [0, 0, 0],
      focalPoint: [0, 0, 0]
    }
    this.textToPatternCache = new Map()
    
    this.initializeSensoryNodes()
  }
  
  /**
   * Initialize sensory nodes from base lattice
   */
  private initializeSensoryNodes() {
    const baseNodes = this.latticeSimulator.getNodes()
    
    baseNodes.forEach((node, idx) => {
      const address = this.nodeIndexToAddress(idx)
      const sensoryNode: SensoryNode = {
        ...node,
        address,
        sensoryEncoding: this.createDefaultSensoryEncoding(),
        umbilicalConnections: [],
        isActive: false
      }
      
      const addressKey = this.addressToString(address)
      this.sensoryNodes.set(addressKey, sensoryNode)
    })
  }
  
  /**
   * Convert node index to octave/integer address
   */
  private nodeIndexToAddress(index: number): NodeAddress {
    // Map index to octave (0-12) and integer within octave
    const octave = Math.floor(Math.log2(index + 1))
    const octaveStart = Math.pow(2, octave) - 1
    const integer = index - octaveStart
    
    return { octave, integer }
  }
  
  /**
   * Convert address to string key
   */
  private addressToString(address: NodeAddress): string {
    return `${address.octave}:${address.integer}${address.harmonic ? `:${address.harmonic}` : ''}`
  }
  
  /**
   * Convert address to node index
   */
  private addressToIndex(address: NodeAddress): number {
    const octaveStart = Math.pow(2, address.octave) - 1
    return Math.min(599, octaveStart + address.integer)
  }
  
  /**
   * Create default sensory encoding
   */
  private createDefaultSensoryEncoding(): SensoryEncoding {
    return {
      visual: {
        color: [0.4, 0.7, 0.9],  // Default cyan
        intensity: 0.5,
        pattern: 'wave',
        frequency: 1.0
      },
      density: 0.5,
      coherence: 0.8
    }
  }
  
  /**
   * Convert text prompt to sensory encoding using NLP and pattern recognition
   */
  textToSensoryEncoding(text: string, _params: Partial<TextToSensoryParams> = {}): SensoryEncoding {
    // Check cache
    const cached = this.textToPatternCache.get(text)
    if (cached) return cached
    
    // Analyze text properties
    const words = text.toLowerCase().split(/\s+/)
    const charCount = text.length
    const vowelRatio = (text.match(/[aeiou]/gi) || []).length / charCount
    const uppercaseRatio = (text.match(/[A-Z]/g) || []).length / charCount
    
    // Extract emotional/semantic content
    const emotionalWords = {
      warm: ['warm', 'hot', 'fire', 'sun', 'energy', 'passion'],
      cool: ['cool', 'cold', 'ice', 'water', 'calm', 'peace'],
      bright: ['bright', 'light', 'brilliant', 'shine', 'glow'],
      dark: ['dark', 'shadow', 'night', 'deep', 'mystery'],
      fast: ['fast', 'quick', 'rapid', 'speed', 'rush', 'swift'],
      slow: ['slow', 'gentle', 'gradual', 'peaceful', 'calm']
    }
    
    let warmth = 0, coolness = 0, brightness = 0, darkness = 0, speed = 0
    
    words.forEach(word => {
      if (emotionalWords.warm.includes(word)) warmth++
      if (emotionalWords.cool.includes(word)) coolness++
      if (emotionalWords.bright.includes(word)) brightness++
      if (emotionalWords.dark.includes(word)) darkness++
      if (emotionalWords.fast.includes(word)) speed++
      if (emotionalWords.slow.includes(word)) speed--
    })
    
    // Map to color (HSL then convert to RGB)
    const hue = (warmth > coolness) ? 0.05 : 0.55  // Red-orange vs cyan-blue
    const saturation = 0.6 + vowelRatio * 0.4
    const lightness = 0.4 + (brightness - darkness) * 0.1 + 0.2
    
    const color = this.hslToRgb(hue, saturation, lightness)
    
    // Map to pattern
    const patterns: Array<'wave' | 'pulse' | 'spiral' | 'fractal'> = ['wave', 'pulse', 'spiral', 'fractal']
    const patternIndex = Math.abs(text.charCodeAt(0) % patterns.length)
    const pattern = patterns[patternIndex]
    
    // Map to animation frequency
    const baseFrequency = 1.0 + speed * 0.5
    const frequency = Math.max(0.1, Math.min(5.0, baseFrequency))
    
    // Map to density (information richness)
    const density = Math.min(1.0, charCount / 100 + words.length / 20)
    
    // Coherence based on word repetition and structure
    const uniqueWords = new Set(words).size
    const coherence = 1.0 - (uniqueWords / words.length) * 0.5
    
    const encoding: SensoryEncoding = {
      visual: {
        color,
        intensity: 0.6 + uppercaseRatio * 0.4,
        pattern,
        frequency
      },
      density,
      coherence: Math.max(0.3, coherence)
    }
    
    // Cache result
    this.textToPatternCache.set(text, encoding)
    
    return encoding
  }
  
  /**
   * HSL to RGB conversion
   */
  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return [r, g, b]
  }
  
  /**
   * Locate target node using octave/integer address
   */
  locateNode(address: NodeAddress): SensoryNode | null {
    const key = this.addressToString(address)
    return this.sensoryNodes.get(key) || null
  }
  
  /**
   * Establish umbilical frequency connection between nodes
   */
  establishUmbilicalConnection(
    sourceAddress: NodeAddress,
    targetAddress: NodeAddress,
    fidelity: number = 0.95
  ): UmbilicalConnection {
    const sourceNode = this.locateNode(sourceAddress)
    const targetNode = this.locateNode(targetAddress)
    
    if (!sourceNode || !targetNode) {
      throw new Error('Cannot establish connection: node not found')
    }
    
    // Calculate umbilical frequency based on hydrogen hyperfine transition
    // Use 1.420 GHz (1420 MHz) as base, modulated by node resonance
    const sourceOffset = (sourceNode.resonanceFrequency - 127.74) / 127.74
    const targetOffset = (targetNode.resonanceFrequency - 127.74) / 127.74
    const avgOffset = (sourceOffset + targetOffset) / 2
    
    // Umbilical frequency = 1420 MHz ± modulation
    const umbilicalFreq = UMBILICAL_BASE_FREQUENCY * (1 + avgOffset * 0.001)
    
    // Calculate phase alignment
    const phase = Math.atan2(
      sourceNode.spinState.My - targetNode.spinState.My,
      sourceNode.spinState.Mx - targetNode.spinState.Mx
    )
    
    // Calculate connection strength from coherence
    const strength = (sourceNode.coherence + targetNode.coherence) / 2
    
    const connection: UmbilicalConnection = {
      sourceAddress,
      targetAddress,
      frequency: umbilicalFreq,
      bandwidth: CONSCIOUSNESS_BANDWIDTH * 1000,  // Convert to MHz
      fidelity,
      phase,
      strength,
      harmonicMode: this.harmonicMode
    }
    
    // Add to active connections
    this.activeConnections.push(connection)
    
    // Add to node's connection list
    sourceNode.umbilicalConnections.push(connection)
    targetNode.umbilicalConnections.push(connection)
    
    return connection
  }
  
  /**
   * Perform awareness fidelity handshake
   */
  awarenessHandshake(connection: UmbilicalConnection): boolean {
    // Simulate handshake protocol
    const sourceNode = this.locateNode(connection.sourceAddress)
    const targetNode = this.locateNode(connection.targetAddress)
    
    if (!sourceNode || !targetNode) return false
    
    // Check if coherence meets fidelity threshold
    const avgCoherence = (sourceNode.coherence + targetNode.coherence) / 2
    const handshakeSuccess = avgCoherence >= connection.fidelity
    
    if (handshakeSuccess) {
      sourceNode.isActive = true
      targetNode.isActive = true
    }
    
    return handshakeSuccess
  }
  
  /**
   * Apply text-to-sensory transformation to target node(s)
   */
  applyTextToSensoryReality(params: TextToSensoryParams): void {
    const encoding = this.textToSensoryEncoding(params.text, params)
    
    if (params.targetAddress) {
      // Apply to specific node
      const node = this.locateNode(params.targetAddress)
      if (node) {
        node.sensoryEncoding = encoding
        node.isActive = true
        
        // Apply to MRI simulator
        const nodeIndex = this.addressToIndex(params.targetAddress)
        this.mriSimulator.applyRFPulse(
          {
            flipAngle: 90 * params.intensity,
            phase: 0,
            duration: params.duration
          },
          nodeIndex
        )
      }
    } else if (params.autoLocate) {
      // Spread across multiple nodes based on text properties
      const numNodes = Math.min(50, Math.ceil(params.text.length / 2))
      
      for (let i = 0; i < numNodes; i++) {
        const address: NodeAddress = {
          octave: Math.floor(Math.random() * 10),
          integer: Math.floor(Math.random() * 20)
        }
        
        const node = this.locateNode(address)
        if (node) {
          // Vary encoding slightly for each node
          const variedEncoding = { ...encoding }
          variedEncoding.visual = { ...encoding.visual }
          variedEncoding.visual.intensity *= 0.8 + Math.random() * 0.4
          
          node.sensoryEncoding = variedEncoding
          node.isActive = true
        }
      }
    }
  }
  
  /**
   * Zoom into a specific node (infinite telescope)
   */
  zoomIntoNode(nodeIndex: number, depth: number = 1): void {
    this.zoomState.level += depth
    this.zoomState.targetNode = nodeIndex
    this.zoomState.scale *= Math.pow(10, depth)
    
    const nodes = this.latticeSimulator.getNodes()
    if (nodeIndex >= 0 && nodeIndex < nodes.length) {
      const node = nodes[nodeIndex]
      this.zoomState.position = [...node.position]
      this.zoomState.focalPoint = [...node.position]
      
      // Generate nested lattice if zooming deep enough
      const addressKey = this.addressToString(this.nodeIndexToAddress(nodeIndex))
      const sensoryNode = this.sensoryNodes.get(addressKey)
      
      if (sensoryNode && !sensoryNode.nestedLattice && this.zoomState.level > 1) {
        sensoryNode.nestedLattice = this.generateNestedLattice(sensoryNode)
      }
    }
  }
  
  /**
   * Zoom out from current level
   */
  zoomOut(depth: number = 1): void {
    this.zoomState.level = Math.max(0, this.zoomState.level - depth)
    this.zoomState.scale /= Math.pow(10, depth)
    
    if (this.zoomState.level === 0) {
      this.zoomState.targetNode = null
      this.zoomState.position = [0, 0, 0]
      this.zoomState.focalPoint = [0, 0, 0]
    }
  }
  
  /**
   * Generate nested lattice within a node (fractal self-similarity)
   */
  private generateNestedLattice(parentNode: SensoryNode): SensoryNode[] {
    const nestedNodes: SensoryNode[] = []
    const miniLatticeSize = 27  // 3x3x3 mini-lattice
    
    for (let i = 0; i < miniLatticeSize; i++) {
      const offset = 0.1  // Small offset within parent node
      const x = ((i % 3) - 1) * offset
      const y = (Math.floor(i / 3) % 3 - 1) * offset
      const z = (Math.floor(i / 9) - 1) * offset
      
      const nestedNode: SensoryNode = {
        id: parentNode.id * 1000 + i,
        position: [
          parentNode.position[0] + x,
          parentNode.position[1] + y,
          parentNode.position[2] + z
        ],
        awarenessIntensity: parentNode.awarenessIntensity * 0.8,
        coherence: parentNode.coherence,
        resonanceFrequency: parentNode.resonanceFrequency * (1 + i * 0.01),
        spinState: { ...parentNode.spinState },
        connections: [],
        address: {
          octave: parentNode.address.octave + 1,
          integer: i,
          harmonic: parentNode.address.integer
        },
        sensoryEncoding: { ...parentNode.sensoryEncoding },
        umbilicalConnections: [],
        isActive: false
      }
      
      nestedNodes.push(nestedNode)
    }
    
    return nestedNodes
  }
  
  /**
   * Get current zoom state
   */
  getZoomState(): ZoomState {
    return { ...this.zoomState }
  }
  
  /**
   * Get all sensory nodes at current zoom level
   */
  getSensoryNodes(): SensoryNode[] {
    if (this.zoomState.level === 0) {
      // Return top-level nodes
      return Array.from(this.sensoryNodes.values())
    } else if (this.zoomState.targetNode !== null) {
      // Return nested lattice of target node
      const address = this.nodeIndexToAddress(this.zoomState.targetNode)
      const parentNode = this.locateNode(address)
      return parentNode?.nestedLattice || []
    }
    
    return []
  }
  
  /**
   * Get active umbilical connections
   */
  getActiveConnections(): UmbilicalConnection[] {
    return [...this.activeConnections]
  }
  
  /**
   * Update engine state
   */
  evolve(dt: number): void {
    this.latticeSimulator.evolve(dt)
    this.mriSimulator.evolve(dt)
    
    // Update sensory node states from lattice
    const baseNodes = this.latticeSimulator.getNodes()
    baseNodes.forEach((node, idx) => {
      const address = this.nodeIndexToAddress(idx)
      const key = this.addressToString(address)
      const sensoryNode = this.sensoryNodes.get(key)
      
      if (sensoryNode) {
        sensoryNode.spinState = node.spinState
        sensoryNode.coherence = node.coherence
        sensoryNode.awarenessIntensity = node.awarenessIntensity
      }
    })
    
    // Update connection strengths
    this.activeConnections.forEach(conn => {
      const source = this.locateNode(conn.sourceAddress)
      const target = this.locateNode(conn.targetAddress)
      
      if (source && target) {
        conn.strength = (source.coherence + target.coherence) / 2
      }
    })
  }
  
  /**
   * Set harmonic mode (for psychedelic-like expansion)
   */
  setHarmonicMode(mode: number): void {
    this.harmonicMode = Math.max(1, Math.floor(mode))
    this.umbilicalFrequency = UMBILICAL_BASE_FREQUENCY * this.harmonicMode
  }
  
  /**
   * Get current umbilical frequency
   */
  getUmbilicalFrequency(): number {
    return this.umbilicalFrequency
  }
  
  /**
   * Modulate umbilical frequency (simulates coherence disruption/enhancement)
   */
  modulateUmbilicalFrequency(deltaGHz: number): void {
    this.umbilicalFrequency = UMBILICAL_BASE_FREQUENCY + (deltaGHz * 1000)
  }
  
  /**
   * Reset engine
   */
  reset(): void {
    this.latticeSimulator.reset()
    this.mriSimulator.reset()
    this.activeConnections = []
    this.umbilicalFrequency = UMBILICAL_BASE_FREQUENCY
    this.harmonicMode = 1
    this.zoomState = {
      level: 0,
      targetNode: null,
      scale: 1.0,
      position: [0, 0, 0],
      focalPoint: [0, 0, 0]
    }
    this.initializeSensoryNodes()
  }
}

