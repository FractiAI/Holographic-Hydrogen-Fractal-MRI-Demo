/**
 * Hydrogen Spin Mapper
 * Maps smartphone sensor data to hydrogen spin vectors and quantum states
 * 
 * Scientific Foundation:
 * - Magnetometer reads Earth's magnetic field (serves as B0 proxy)
 * - Gyroscope detects rotation (analogous to precession)
 * - Accelerometer measures device orientation (spin alignment)
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface HydrogenSpinState {
  // Magnetization vector (Mx, My, Mz)
  magnetization: Vector3D;
  
  // Phase angle (0-360°)
  phase: number;
  
  // Precession frequency (Hz) - Larmor frequency proxy
  precessionFreq: number;
  
  // Coherence measure (0-1)
  coherence: number;
  
  // Spin orientation angle (degrees)
  spinAngle: number;
  
  // Energy state
  energy: number;
}

export interface SensorData {
  magnetometer: Vector3D;
  accelerometer: Vector3D;
  gyroscope: Vector3D;
  timestamp: number;
}

/**
 * Maps raw sensor data to hydrogen spin parameters
 */
export class HydrogenSpinMapper {
  private readonly HYDROGEN_FREQUENCY = 1.420e9; // 1.420 GHz hyperfine frequency
  private readonly LARMOR_GYROMAGNETIC_RATIO = 42.58e6; // MHz/T for hydrogen
  private previousMagnetization: Vector3D = { x: 0, y: 0, z: 1 };
  private phaseAccumulator = 0;
  private readonly EARTH_FIELD_STRENGTH = 50e-6; // ~50 μT
  
  /**
   * Primary mapping function: Sensor data → Hydrogen spin state
   */
  mapToHydrogenSpin(sensorData: SensorData): HydrogenSpinState {
    // 1. Extract magnetic field vector (serves as B0 direction)
    const B0 = this.normalizeMagneticField(sensorData.magnetometer);
    
    // 2. Calculate transverse and longitudinal magnetization
    const magnetization = this.calculateMagnetization(
      sensorData.accelerometer,
      sensorData.gyroscope,
      B0
    );
    
    // 3. Compute precession frequency from gyroscope
    const precessionFreq = this.calculatePrecessionFrequency(
      sensorData.gyroscope,
      B0
    );
    
    // 4. Update phase based on precession
    this.phaseAccumulator = (this.phaseAccumulator + precessionFreq * 0.016) % 360;
    
    // 5. Calculate coherence from motion stability
    const coherence = this.calculateCoherence(
      sensorData.accelerometer,
      sensorData.gyroscope
    );
    
    // 6. Determine spin angle
    const spinAngle = this.calculateSpinAngle(magnetization, B0);
    
    // 7. Calculate energy state
    const energy = this.calculateEnergy(magnetization, B0);
    
    this.previousMagnetization = magnetization;
    
    return {
      magnetization,
      phase: this.phaseAccumulator,
      precessionFreq,
      coherence,
      spinAngle,
      energy
    };
  }
  
  /**
   * Normalize magnetic field to unit vector
   */
  private normalizeMagneticField(mag: Vector3D): Vector3D {
    const magnitude = Math.sqrt(mag.x ** 2 + mag.y ** 2 + mag.z ** 2);
    if (magnitude === 0) return { x: 0, y: 0, z: 1 };
    
    return {
      x: mag.x / magnitude,
      y: mag.y / magnitude,
      z: mag.z / magnitude
    };
  }
  
  /**
   * Calculate magnetization vector (Mx, My, Mz)
   * Mx, My = transverse magnetization (creates MRI signal)
   * Mz = longitudinal magnetization (equilibrium)
   */
  private calculateMagnetization(
    accel: Vector3D,
    gyro: Vector3D,
    B0: Vector3D
  ): Vector3D {
    // Use device tilt (from accelerometer) as spin tip angle
    const tiltMagnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2);
    const tiltAngle = Math.atan2(tiltMagnitude, accel.z);
    
    // Gyroscope indicates precession around B0
    const precessionRate = Math.sqrt(gyro.x ** 2 + gyro.y ** 2 + gyro.z ** 2);
    
    // Calculate transverse magnetization (Mx, My)
    // Higher tilt = more transverse magnetization (stronger signal)
    const transverseMag = Math.sin(tiltAngle);
    
    // Longitudinal magnetization (Mz)
    // Aligned with B0 at equilibrium
    const Mz = Math.cos(tiltAngle);
    
    // Phase determines Mx and My distribution
    const phase = this.phaseAccumulator * Math.PI / 180;
    const Mx = transverseMag * Math.cos(phase) * (1 - precessionRate * 0.1);
    const My = transverseMag * Math.sin(phase) * (1 - precessionRate * 0.1);
    
    return { x: Mx, y: My, z: Mz };
  }
  
  /**
   * Calculate Larmor precession frequency
   * ω₀ = γ * B₀ (Larmor equation)
   */
  private calculatePrecessionFrequency(gyro: Vector3D, B0: Vector3D): number {
    // Gyroscope measures device rotation rate
    // Map this to hydrogen precession frequency
    const gyroMagnitude = Math.sqrt(gyro.x ** 2 + gyro.y ** 2 + gyro.z ** 2);
    
    // Scale gyroscope (rad/s) to Hz
    // Typical gyro range: 0-5 rad/s → map to 0-100 Hz for visualization
    const freqHz = (gyroMagnitude / (2 * Math.PI)) * 20;
    
    // Add base frequency from magnetic field strength
    const baseFreq = this.LARMOR_GYROMAGNETIC_RATIO * this.EARTH_FIELD_STRENGTH / 1e6; // ~2 kHz
    
    return freqHz + baseFreq / 1000; // Scale down for haptics
  }
  
  /**
   * Calculate coherence (phase alignment of spins)
   * High stability = high coherence
   * Motion/vibration = dephasing (loss of coherence)
   */
  private calculateCoherence(accel: Vector3D, gyro: Vector3D): number {
    // Measure motion magnitude
    const accelMag = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
    const gyroMag = Math.sqrt(gyro.x ** 2 + gyro.y ** 2 + gyro.z ** 2);
    
    // Deviation from equilibrium (1g)
    const accelDeviation = Math.abs(accelMag - 9.81) / 9.81;
    
    // Calculate coherence (inverse of motion)
    const coherence = 1 / (1 + accelDeviation * 2 + gyroMag * 0.5);
    
    return Math.max(0, Math.min(1, coherence));
  }
  
  /**
   * Calculate spin angle relative to B0
   */
  private calculateSpinAngle(mag: Vector3D, B0: Vector3D): number {
    // Angle between magnetization and B0
    const dotProduct = mag.x * B0.x + mag.y * B0.y + mag.z * B0.z;
    const angleDeg = Math.acos(dotProduct) * 180 / Math.PI;
    return angleDeg;
  }
  
  /**
   * Calculate energy state (Zeeman energy)
   * E = -μ · B₀
   */
  private calculateEnergy(mag: Vector3D, B0: Vector3D): number {
    // Simplified: energy proportional to alignment with B0
    const alignment = mag.z; // Assuming B0 is along z
    return -alignment; // Negative for spin-up, positive for spin-down
  }
  
  /**
   * Generate fractal pattern coordinates from spin state
   */
  generateFractalPattern(spinState: HydrogenSpinState, depth: number = 5): Vector3D[] {
    const points: Vector3D[] = [];
    const { magnetization, phase } = spinState;
    
    // Mandelbrot-inspired fractal generation based on spin parameters
    const centerX = magnetization.x;
    const centerY = magnetization.y;
    
    for (let i = 0; i < depth; i++) {
      const angle = (phase + i * 72) * Math.PI / 180; // Golden angle
      const radius = Math.pow(0.618, i); // Golden ratio decay
      
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        z: magnetization.z * Math.pow(0.8, i)
      });
    }
    
    return points;
  }
  
  /**
   * Generate haptic pattern from spin state
   */
  generateHapticPattern(spinState: HydrogenSpinState): {
    intensity: number;
    frequency: number;
    duration: number;
  } {
    // Map spin parameters to haptic feedback
    const { coherence, precessionFreq, energy } = spinState;
    
    // Intensity based on transverse magnetization
    const transverseMag = Math.sqrt(
      spinState.magnetization.x ** 2 + spinState.magnetization.y ** 2
    );
    
    return {
      intensity: transverseMag * coherence, // 0-1
      frequency: Math.min(precessionFreq, 50), // Cap at 50 Hz for haptics
      duration: 50 // ms
    };
  }
  
  /**
   * Reset mapper state
   */
  reset(): void {
    this.previousMagnetization = { x: 0, y: 0, z: 1 };
    this.phaseAccumulator = 0;
  }
}

export default HydrogenSpinMapper;



