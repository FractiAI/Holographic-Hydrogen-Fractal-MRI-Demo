/**
 * Self-Awareness Node (SSAN) Lattice System
 * 
 * Implements a 600-node lattice capable of recursive self-imaging
 * using biological, quantum, and hydrogen-holographic fields.
 * 
 * Core Concept:
 * - Each node represents a quantum hydrogen state with awareness properties
 * - Lattice can "image" its own state using MRI-like techniques
 * - Ψₐ (awareness energy) ≈ 9.63×10⁻³⁴ J·s (near Planck constant scale)
 */

import { BlochSimulator, MRIParameters, SpinState } from './BlochSimulator'

export interface SSANNode {
  id: number
  position: [number, number, number]
  awarenessIntensity: number  // Ψₐ local amplitude
  coherence: number            // Phase coherence with neighbors
  resonanceFrequency: number   // Local Larmor frequency variation
  spinState: SpinState         // Current magnetization vector
  connections: number[]        // Connected node IDs
}

export interface SSANLatticeState {
  nodes: SSANNode[]
  globalAwareness: number      // Average Ψₐ across lattice
  totalCoherence: number       // Network coherence metric
  energyDistribution: number[] // Energy per node
  timestamp: number
}

export interface SSANMetrics {
  coherence: number
  alignment: number
  novelty: number
  density: number
  awarenessEnergy: number
}

/**
 * SSAN Lattice Configuration
 */
export interface SSANConfig {
  numNodes: number
  latticeType: 'cubic' | 'fcc' | 'bcc' | 'hexagonal'
  baseAwareness: number        // Base Ψₐ ≈ 9.63×10⁻³⁴ J·s
  coherenceThreshold: number
  connectionRadius: number
}

export const DEFAULT_SSAN_CONFIG: SSANConfig = {
  numNodes: 600,
  latticeType: 'fcc',  // Face-centered cubic for optimal packing
  baseAwareness: 9.63e-34,  // Near Planck constant
  coherenceThreshold: 0.85,
  connectionRadius: 1.5
}

/**
 * SSAN Lattice Simulator
 * Integrates with MRI physics for self-imaging capabilities
 */
export class SSANLatticeSimulator {
  private config: SSANConfig
  private nodes: SSANNode[]
  private mriSimulator: BlochSimulator
  private history: SSANLatticeState[]
  private scanData: Map<string, any>
  
  constructor(config: SSANConfig = DEFAULT_SSAN_CONFIG) {
    this.config = config
    this.nodes = []
    this.history = []
    this.scanData = new Map()
    
    // Initialize MRI simulator with appropriate parameters
    const mriParams: MRIParameters = {
      B0: 3.0,
      T1: 1000,
      T2: 100,
      gamma: 42.58,
      M0: 1.0
    }
    
    this.mriSimulator = new BlochSimulator(mriParams, config.numNodes)
    this.initializeLattice()
  }
  
  /**
   * Initialize 600-node lattice structure
   */
  private initializeLattice() {
    const positions = this.generateLatticePositions()
    
    this.nodes = positions.map((pos, id) => {
      // Add quantum fluctuations to awareness
      const quantumNoise = (Math.random() - 0.5) * 0.1 * this.config.baseAwareness
      
      return {
        id,
        position: pos,
        awarenessIntensity: this.config.baseAwareness + quantumNoise,
        coherence: 0.9 + Math.random() * 0.1,  // High initial coherence
        resonanceFrequency: 127.74 + (Math.random() - 0.5) * 10,  // MHz at 3T ± variation
        spinState: { Mx: 0, My: 0, Mz: 1.0 },
        connections: []
      }
    })
    
    // Establish connections based on proximity
    this.establishConnections()
  }
  
  /**
   * Generate lattice node positions based on configuration
   */
  private generateLatticePositions(): [number, number, number][] {
    const positions: [number, number, number][] = []
    const { numNodes, latticeType } = this.config
    
    // Calculate approximate grid dimensions for target node count
    const nodesPerDim = Math.ceil(Math.pow(numNodes, 1/3))
    const spacing = 1.0
    const offset = (nodesPerDim - 1) * spacing / 2
    
    let count = 0
    
    switch (latticeType) {
      case 'fcc':  // Face-centered cubic
        // Base cubic lattice + face centers
        for (let x = 0; x < nodesPerDim && count < numNodes; x++) {
          for (let y = 0; y < nodesPerDim && count < numNodes; y++) {
            for (let z = 0; z < nodesPerDim && count < numNodes; z++) {
              const baseX = x * spacing - offset
              const baseY = y * spacing - offset
              const baseZ = z * spacing - offset
              
              // Corner node
              positions.push([baseX, baseY, baseZ])
              count++
              
              // Face centers (if within bounds)
              if (count < numNodes && x < nodesPerDim - 1) {
                positions.push([baseX + spacing/2, baseY, baseZ])
                count++
              }
              if (count < numNodes && y < nodesPerDim - 1) {
                positions.push([baseX, baseY + spacing/2, baseZ])
                count++
              }
              if (count < numNodes && z < nodesPerDim - 1) {
                positions.push([baseX, baseY, baseZ + spacing/2])
                count++
              }
            }
          }
        }
        break
        
      case 'cubic':
      default:
        // Simple cubic lattice
        for (let x = 0; x < nodesPerDim && count < numNodes; x++) {
          for (let y = 0; y < nodesPerDim && count < numNodes; y++) {
            for (let z = 0; z < nodesPerDim && count < numNodes; z++) {
              positions.push([
                x * spacing - offset,
                y * spacing - offset,
                z * spacing - offset
              ])
              count++
            }
          }
        }
        break
    }
    
    return positions.slice(0, numNodes)
  }
  
  /**
   * Establish connections between nearby nodes
   */
  private establishConnections() {
    const { connectionRadius } = this.config
    
    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i]
      nodeA.connections = []
      
      for (let j = 0; j < this.nodes.length; j++) {
        if (i === j) continue
        
        const nodeB = this.nodes[j]
        const distance = this.calculateDistance(nodeA.position, nodeB.position)
        
        if (distance <= connectionRadius) {
          nodeA.connections.push(j)
        }
      }
    }
  }
  
  /**
   * Calculate Euclidean distance between positions
   */
  private calculateDistance(a: [number, number, number], b: [number, number, number]): number {
    const dx = a[0] - b[0]
    const dy = a[1] - b[1]
    const dz = a[2] - b[2]
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
  
  /**
   * Perform recursive self-imaging scan
   * The lattice measures its own awareness state
   */
  performSelfImagingScan(): SSANLatticeState {
    // Step 1: Apply RF pulse to excite all nodes
    this.mriSimulator.applyRFPulse({ flipAngle: 90, phase: 0, duration: 1 })
    
    // Step 2: Evolve system (simulate signal acquisition)
    for (let t = 0; t < 10; t++) {
      this.mriSimulator.evolve(1.0)
    }
    
    // Step 3: Read out spin states for each node
    const spinStates = this.mriSimulator.getAllSpinStates()
    
    // Step 4: Update node states based on MRI readout
    this.nodes.forEach((node, i) => {
      node.spinState = spinStates[i]
      
      // Calculate awareness intensity from spin coherence
      const transverseMag = Math.sqrt(node.spinState.Mx ** 2 + node.spinState.My ** 2)
      node.awarenessIntensity = this.config.baseAwareness * (0.5 + 0.5 * transverseMag)
      
      // Update coherence based on neighbor correlation
      node.coherence = this.calculateLocalCoherence(node)
    })
    
    // Step 5: Calculate global metrics
    const state: SSANLatticeState = {
      nodes: this.nodes.map(n => ({ ...n })),
      globalAwareness: this.calculateGlobalAwareness(),
      totalCoherence: this.calculateTotalCoherence(),
      energyDistribution: this.calculateEnergyDistribution(),
      timestamp: Date.now()
    }
    
    // Store in history
    this.history.push(state)
    
    // Store scan data for export
    this.scanData.set(`scan_${state.timestamp}`, state)
    
    return state
  }
  
  /**
   * Calculate local coherence with neighboring nodes
   */
  private calculateLocalCoherence(node: SSANNode): number {
    if (node.connections.length === 0) return 0.5
    
    let coherenceSum = 0
    
    for (const neighborId of node.connections) {
      const neighbor = this.nodes[neighborId]
      
      // Phase correlation between spin states
      const dotProduct = 
        node.spinState.Mx * neighbor.spinState.Mx +
        node.spinState.My * neighbor.spinState.My +
        node.spinState.Mz * neighbor.spinState.Mz
      
      coherenceSum += Math.abs(dotProduct)
    }
    
    return coherenceSum / node.connections.length
  }
  
  /**
   * Calculate global awareness (average Ψₐ)
   */
  private calculateGlobalAwareness(): number {
    const sum = this.nodes.reduce((acc, node) => acc + node.awarenessIntensity, 0)
    return sum / this.nodes.length
  }
  
  /**
   * Calculate total lattice coherence
   */
  private calculateTotalCoherence(): number {
    const sum = this.nodes.reduce((acc, node) => acc + node.coherence, 0)
    return sum / this.nodes.length
  }
  
  /**
   * Calculate energy distribution across nodes
   */
  private calculateEnergyDistribution(): number[] {
    return this.nodes.map(node => {
      // Energy proportional to magnetization magnitude
      const mag = Math.sqrt(
        node.spinState.Mx ** 2 +
        node.spinState.My ** 2 +
        node.spinState.Mz ** 2
      )
      return node.awarenessIntensity * mag / this.config.baseAwareness
    })
  }
  
  /**
   * Evolve lattice dynamics over time
   */
  evolve(dt: number) {
    // Evolve MRI physics
    this.mriSimulator.evolve(dt)
    
    // Update node spin states
    const spinStates = this.mriSimulator.getAllSpinStates()
    this.nodes.forEach((node, i) => {
      node.spinState = spinStates[i]
    })
    
    // Propagate awareness through network
    this.propagateAwareness(dt)
  }
  
  /**
   * Propagate awareness between connected nodes
   */
  private propagateAwareness(dt: number) {
    const propagationSpeed = 0.01
    
    // Create temporary copy for parallel update
    const awarenessUpdates = new Array(this.nodes.length).fill(0)
    
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]
      let totalInflux = 0
      
      for (const neighborId of node.connections) {
        const neighbor = this.nodes[neighborId]
        const gradient = neighbor.awarenessIntensity - node.awarenessIntensity
        totalInflux += gradient * propagationSpeed * dt
      }
      
      awarenessUpdates[i] = totalInflux
    }
    
    // Apply updates
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].awarenessIntensity += awarenessUpdates[i]
      
      // Keep within physical bounds
      if (this.nodes[i].awarenessIntensity < 0) {
        this.nodes[i].awarenessIntensity = 0
      }
    }
  }
  
  /**
   * Calculate comprehensive SSAN metrics
   */
  calculateMetrics(): SSANMetrics {
    const coherence = this.calculateTotalCoherence()
    
    // Alignment: how well nodes are magnetization-aligned
    let alignmentSum = 0
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const a = this.nodes[i].spinState
      const b = this.nodes[i + 1].spinState
      const dot = a.Mx * b.Mx + a.My * b.My + a.Mz * b.Mz
      alignmentSum += Math.abs(dot)
    }
    const alignment = alignmentSum / (this.nodes.length - 1)
    
    // Novelty: variance in awareness distribution
    const avgAwareness = this.calculateGlobalAwareness()
    const variance = this.nodes.reduce((sum, node) => {
      const diff = node.awarenessIntensity - avgAwareness
      return sum + diff * diff
    }, 0) / this.nodes.length
    const novelty = Math.min(1.0, variance / (this.config.baseAwareness ** 2))
    
    // Density: average connection count
    const avgConnections = this.nodes.reduce((sum, node) => sum + node.connections.length, 0) / this.nodes.length
    const density = avgConnections / 12  // Normalize to max expected connections
    
    return {
      coherence,
      alignment,
      novelty,
      density,
      awarenessEnergy: this.calculateGlobalAwareness()
    }
  }
  
  /**
   * Apply perturbation to specific nodes
   */
  perturbNode(nodeId: number, intensity: number) {
    if (nodeId >= 0 && nodeId < this.nodes.length) {
      this.nodes[nodeId].awarenessIntensity *= (1 + intensity)
      
      // Apply RF pulse to this node
      this.mriSimulator.applyRFPulse(
        { flipAngle: 90 * intensity, phase: 0, duration: 1 },
        nodeId
      )
    }
  }
  
  /**
   * Reset lattice to equilibrium
   */
  reset() {
    this.mriSimulator.reset()
    this.initializeLattice()
    this.history = []
  }
  
  /**
   * Export scan data for analysis
   */
  exportScanData(): string {
    const exportData = {
      config: this.config,
      currentState: {
        nodes: this.nodes,
        metrics: this.calculateMetrics(),
        timestamp: Date.now()
      },
      history: this.history,
      metadata: {
        totalScans: this.history.length,
        latticeType: this.config.latticeType,
        nodeCount: this.nodes.length
      }
    }
    
    return JSON.stringify(exportData, null, 2)
  }
  
  /**
   * Get nodes for visualization
   */
  getNodes(): SSANNode[] {
    return this.nodes.map(n => ({ ...n }))
  }
  
  /**
   * Get current lattice state
   */
  getCurrentState(): SSANLatticeState {
    return {
      nodes: this.nodes.map(n => ({ ...n })),
      globalAwareness: this.calculateGlobalAwareness(),
      totalCoherence: this.calculateTotalCoherence(),
      energyDistribution: this.calculateEnergyDistribution(),
      timestamp: Date.now()
    }
  }
  
  /**
   * Get scan history
   */
  getHistory(): SSANLatticeState[] {
    return this.history
  }
}





