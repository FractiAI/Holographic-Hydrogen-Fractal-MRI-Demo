/**
 * Bloch Equation Simulator for MRI Physics
 * 
 * Simulates real hydrogen spin dynamics based on the Bloch equations:
 * dMx/dt = γ(M × B)x - Mx/T2
 * dMy/dt = γ(M × B)y - My/T2
 * dMz/dt = γ(M × B)z + (M0 - Mz)/T1
 * 
 * Where:
 * - M is the magnetization vector (Mx, My, Mz)
 * - B is the magnetic field
 * - γ is the gyromagnetic ratio for hydrogen (42.58 MHz/T)
 * - T1 is the longitudinal relaxation time
 * - T2 is the transverse relaxation time
 * - M0 is the equilibrium magnetization
 */

export interface SpinState {
  Mx: number  // Transverse magnetization (x-component)
  My: number  // Transverse magnetization (y-component)
  Mz: number  // Longitudinal magnetization (z-component)
}

export interface MRIParameters {
  B0: number           // Main magnetic field strength (Tesla)
  T1: number           // Longitudinal relaxation time (ms)
  T2: number           // Transverse relaxation time (ms)
  gamma: number        // Gyromagnetic ratio (MHz/T)
  M0: number           // Equilibrium magnetization
}

export interface RFPulse {
  flipAngle: number    // Flip angle in degrees
  phase: number        // RF phase in degrees
  duration: number     // Pulse duration in ms
}

// Default parameters for hydrogen in water at 3T
export const DEFAULT_MRI_PARAMS: MRIParameters = {
  B0: 3.0,              // 3 Tesla field
  T1: 1000,             // 1000 ms (1 second) for water
  T2: 100,              // 100 ms for water
  gamma: 42.58,         // MHz/T for hydrogen
  M0: 1.0               // Normalized equilibrium magnetization
}

export class BlochSimulator {
  private params: MRIParameters
  private spinStates: SpinState[]
  
  constructor(params: MRIParameters = DEFAULT_MRI_PARAMS, numSpins: number = 1) {
    this.params = { ...params }
    this.spinStates = Array(numSpins).fill(null).map(() => ({
      Mx: 0,
      My: 0,
      Mz: params.M0  // Start at equilibrium
    }))
  }

  /**
   * Apply an RF pulse to all spins
   */
  applyRFPulse(pulse: RFPulse, spinIndex?: number) {
    const { flipAngle, phase } = pulse
    const theta = (flipAngle * Math.PI) / 180  // Convert to radians
    const phi = (phase * Math.PI) / 180
    
    const spinsToRotate = spinIndex !== undefined 
      ? [this.spinStates[spinIndex]] 
      : this.spinStates
    
    spinsToRotate.forEach(spin => {
      // Rotation matrix for RF pulse
      const Mx_new = spin.Mx * Math.cos(theta) + 
                     spin.Mz * Math.sin(theta) * Math.cos(phi)
      const My_new = spin.My * Math.cos(theta) + 
                     spin.Mz * Math.sin(theta) * Math.sin(phi)
      const Mz_new = spin.Mz * Math.cos(theta) - 
                     spin.Mx * Math.sin(theta) * Math.cos(phi) - 
                     spin.My * Math.sin(theta) * Math.sin(phi)
      
      spin.Mx = Mx_new
      spin.My = My_new
      spin.Mz = Mz_new
    })
  }

  /**
   * Evolve spin states over time according to Bloch equations
   */
  evolve(dt: number, offResonance: number[] = []) {
    const { T1, T2, M0, gamma, B0 } = this.params
    
    this.spinStates.forEach((spin, i) => {
      // Off-resonance frequency (Hz) for this spin
      const deltaOmega = offResonance[i] || 0
      const omega = 2 * Math.PI * (gamma * 1e6 * B0 + deltaOmega)  // Angular frequency
      
      // Bloch equations integration (simplified Euler method)
      // For more accuracy, could use Runge-Kutta
      
      // Precession in transverse plane
      const Mx_old = spin.Mx
      const My_old = spin.My
      
      // Relaxation and precession
      spin.Mx = Mx_old * (1 - dt / T2) + My_old * omega * dt
      spin.My = My_old * (1 - dt / T2) - Mx_old * omega * dt
      spin.Mz = spin.Mz + ((M0 - spin.Mz) / T1) * dt
      
      // Ensure magnetization doesn't exceed physical limits
      const transverse = Math.sqrt(spin.Mx ** 2 + spin.My ** 2)
      if (transverse > M0) {
        const scale = M0 / transverse
        spin.Mx *= scale
        spin.My *= scale
      }
      
      if (Math.abs(spin.Mz) > M0) {
        spin.Mz = Math.sign(spin.Mz) * M0
      }
    })
  }

  /**
   * Get current signal (sum of transverse magnetization)
   */
  getSignal(): { real: number; imag: number; magnitude: number } {
    const totalMx = this.spinStates.reduce((sum, s) => sum + s.Mx, 0)
    const totalMy = this.spinStates.reduce((sum, s) => sum + s.My, 0)
    
    return {
      real: totalMx,
      imag: totalMy,
      magnitude: Math.sqrt(totalMx ** 2 + totalMy ** 2)
    }
  }

  /**
   * Get individual spin state
   */
  getSpinState(index: number): SpinState {
    return { ...this.spinStates[index] }
  }

  /**
   * Get all spin states
   */
  getAllSpinStates(): SpinState[] {
    return this.spinStates.map(s => ({ ...s }))
  }

  /**
   * Reset all spins to equilibrium
   */
  reset() {
    this.spinStates.forEach(spin => {
      spin.Mx = 0
      spin.My = 0
      spin.Mz = this.params.M0
    })
  }

  /**
   * Set custom spin state
   */
  setSpinState(index: number, state: Partial<SpinState>) {
    if (index >= 0 && index < this.spinStates.length) {
      this.spinStates[index] = { ...this.spinStates[index], ...state }
    }
  }

  /**
   * Add random dephasing to simulate inhomogeneity
   */
  addDephasing(amount: number) {
    this.spinStates.forEach(spin => {
      const phase = (Math.random() - 0.5) * amount * Math.PI * 2
      const Mx_new = spin.Mx * Math.cos(phase) - spin.My * Math.sin(phase)
      const My_new = spin.Mx * Math.sin(phase) + spin.My * Math.cos(phase)
      spin.Mx = Mx_new
      spin.My = My_new
    })
  }

  /**
   * Update MRI parameters
   */
  updateParameters(params: Partial<MRIParameters>) {
    this.params = { ...this.params, ...params }
  }

  /**
   * Get current parameters
   */
  getParameters(): MRIParameters {
    return { ...this.params }
  }

  /**
   * Calculate Larmor frequency
   */
  getLarmorFrequency(): number {
    return this.params.gamma * this.params.B0  // MHz
  }

  /**
   * Simulate a complete spin echo sequence
   */
  simulateSpinEcho(TE: number): { time: number[]; signal: number[] } {
    this.reset()
    
    const timePoints: number[] = []
    const signal: number[] = []
    const dt = 0.1  // ms
    
    // 90° pulse
    this.applyRFPulse({ flipAngle: 90, phase: 0, duration: 1 })
    
    // Evolution to TE/2
    for (let t = 0; t < TE / 2; t += dt) {
      this.evolve(dt)
      timePoints.push(t)
      signal.push(this.getSignal().magnitude)
    }
    
    // 180° pulse
    this.applyRFPulse({ flipAngle: 180, phase: 0, duration: 1 })
    
    // Evolution to TE
    for (let t = TE / 2; t < TE; t += dt) {
      this.evolve(dt)
      timePoints.push(t)
      signal.push(this.getSignal().magnitude)
    }
    
    return { time: timePoints, signal }
  }

  /**
   * Simulate gradient echo sequence
   */
  simulateGradientEcho(TR: number, TE: number, flipAngle: number): number {
    this.reset()
    
    // Apply flip angle
    this.applyRFPulse({ flipAngle, phase: 0, duration: 1 })
    
    // Evolve to TE
    const dt = 0.1
    for (let t = 0; t < TE; t += dt) {
      this.evolve(dt)
    }
    
    const signal = this.getSignal().magnitude
    
    // Evolve to TR
    for (let t = TE; t < TR; t += dt) {
      this.evolve(dt)
    }
    
    return signal
  }
}

/**
 * Create a grid of spins with spatial distribution
 */
export function createSpinGrid(
  gridSize: number,
  params: MRIParameters = DEFAULT_MRI_PARAMS
): { simulator: BlochSimulator; positions: [number, number, number][] } {
  const numSpins = gridSize * gridSize * gridSize
  const simulator = new BlochSimulator(params, numSpins)
  const positions: [number, number, number][] = []
  
  const step = 1 / gridSize
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        positions.push([
          (x - gridSize / 2) * step,
          (y - gridSize / 2) * step,
          (z - gridSize / 2) * step
        ])
      }
    }
  }
  
  return { simulator, positions }
}

/**
 * Helper to convert magnetization to color for visualization
 */
export function magnetizationToColor(spin: SpinState, M0: number = 1): {
  r: number
  g: number
  b: number
} {
  // Mz: blue (equilibrium) to red (inverted)
  // Transverse: green intensity
  const transverse = Math.sqrt(spin.Mx ** 2 + spin.My ** 2)
  
  const r = Math.max(0, Math.min(1, 0.5 - spin.Mz / (2 * M0)))  // Red when inverted
  const g = Math.max(0, Math.min(1, transverse / M0))            // Green for transverse
  const b = Math.max(0, Math.min(1, 0.5 + spin.Mz / (2 * M0)))  // Blue at equilibrium
  
  return { r, g, b }
}



