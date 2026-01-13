/**
 * Full Sensory Field Generator
 * Creates high-fidelity magnetic cloud immersion using all smartphone emitters
 * 
 * SENSORY CHANNELS:
 * 1. Haptic - Continuous vibration field (magnetic flux density)
 * 2. Audio - Hydrogen resonance frequencies (1.420 GHz harmonics)
 * 3. Visual - Screen as light emitter (field intensity)
 * 4. Proximity - Distance-based field strength
 * 5. Binaural - Awareness entrainment
 */

import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { HydrogenSpinState } from '../sensors/HydrogenSpinMapper';

export interface SensoryField {
  // Haptic field
  hapticIntensity: number;      // 0-1 (vibration amplitude)
  hapticFrequency: number;       // Hz (vibration frequency)
  hapticPattern: 'pulse' | 'wave' | 'field' | 'resonance';
  
  // Audio field
  audioFrequency: number;        // Hz (base frequency)
  binaural: boolean;             // Enable binaural beats
  binauralBeat: number;          // Hz (beat frequency)
  harmonics: number[];           // Harmonic overtones
  
  // Visual field
  visualIntensity: number;       // 0-1 (screen brightness)
  visualColor: string;           // Color temperature
  pulseRate: number;             // Hz (screen pulse)
  
  // Proximity field
  proximityStrength: number;     // 0-1 (field strength at distance)
  fieldRadius: number;           // meters (effective range)
}

export class FullSensoryFieldGenerator {
  private audioContext: any = null;
  private oscillators: any[] = [];
  private gainNode: any = null;
  private isActive = false;
  private hapticInterval: any = null;
  private visualCallback: ((intensity: number, color: string) => void) | null = null;
  
  // Hydrogen hyperfine frequency (scaled to audible range)
  private readonly HYDROGEN_BASE = 432; // Hz (A = 432 Hz, cosmic tuning)
  private readonly LARMOR_HARMONIC = 63.87; // MHz → scaled to Hz
  
  /**
   * Initialize audio context and oscillators
   */
  async initialize(): Promise<void> {
    try {
      // Request audio permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false
      });
      
      console.log('✅ Full sensory field generator initialized');
    } catch (error) {
      console.error('Error initializing sensory field:', error);
    }
  }
  
  /**
   * Generate full sensory field from spin state
   */
  generateField(spinState: HydrogenSpinState): SensoryField {
    const { magnetization, phase, precessionFreq, coherence, energy } = spinState;
    
    // Calculate transverse magnetization (creates the "signal")
    const transverseMag = Math.sqrt(magnetization.x ** 2 + magnetization.y ** 2);
    
    // Haptic field parameters
    const hapticIntensity = transverseMag * coherence; // Strong when coherent
    const hapticFrequency = Math.min(precessionFreq * 2, 80); // Perceptible range
    const hapticPattern = this.selectHapticPattern(coherence, transverseMag);
    
    // Audio field parameters
    const audioFrequency = this.calculateResonanceFrequency(magnetization, phase);
    const binauralBeat = precessionFreq; // Creates entrainment
    const harmonics = this.generateHarmonics(audioFrequency, coherence);
    
    // Visual field parameters
    const visualIntensity = 0.3 + coherence * 0.7; // Dim to bright
    const visualColor = this.calculateFieldColor(energy, phase);
    const pulseRate = Math.abs(Math.sin(phase * Math.PI / 180)) * 10; // 0-10 Hz
    
    // Proximity field (stronger when phone is closer)
    const proximityStrength = transverseMag * (0.5 + coherence * 0.5);
    const fieldRadius = 0.5 + coherence * 0.5; // 0.5-1.0 meter effective range
    
    return {
      hapticIntensity,
      hapticFrequency,
      hapticPattern,
      audioFrequency,
      binaural: coherence > 0.5, // Enable binaural when coherent
      binauralBeat,
      harmonics,
      visualIntensity,
      visualColor,
      pulseRate,
      proximityStrength,
      fieldRadius
    };
  }
  
  /**
   * Activate full sensory immersion
   */
  async activate(field: SensoryField): Promise<void> {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // Start haptic field
    this.activateHapticField(field);
    
    // Start audio field
    await this.activateAudioField(field);
    
    // Start visual field
    this.activateVisualField(field);
    
    console.log('⚡ Full sensory immersion activated');
  }
  
  /**
   * Update sensory field in real-time
   */
  async update(field: SensoryField): Promise<void> {
    if (!this.isActive) return;
    
    // Update haptic
    this.updateHapticField(field);
    
    // Update audio
    await this.updateAudioField(field);
    
    // Update visual
    this.updateVisualField(field);
  }
  
  /**
   * Deactivate all sensory channels
   */
  deactivate(): void {
    this.isActive = false;
    
    // Stop haptics
    if (this.hapticInterval) {
      clearInterval(this.hapticInterval);
      this.hapticInterval = null;
    }
    
    // Stop audio
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];
    
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    
    console.log('🛑 Sensory immersion deactivated');
  }
  
  /**
   * HAPTIC FIELD - Continuous vibration patterns
   */
  private activateHapticField(field: SensoryField): void {
    const intervalMs = 1000 / field.hapticFrequency;
    
    this.hapticInterval = setInterval(() => {
      this.triggerHapticPattern(field.hapticPattern, field.hapticIntensity);
    }, intervalMs);
  }
  
  private updateHapticField(field: SensoryField): void {
    if (this.hapticInterval) {
      clearInterval(this.hapticInterval);
    }
    this.activateHapticField(field);
  }
  
  private triggerHapticPattern(pattern: string, intensity: number): void {
    const style = 
      intensity > 0.7 ? Haptics.ImpactFeedbackStyle.Heavy :
      intensity > 0.4 ? Haptics.ImpactFeedbackStyle.Medium :
      Haptics.ImpactFeedbackStyle.Light;
    
    switch (pattern) {
      case 'pulse':
        Haptics.impactAsync(style);
        break;
      case 'wave':
        // Double pulse for wave sensation
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeout(() => Haptics.impactAsync(style), 30);
        break;
      case 'field':
        // Sustained field sensation (rapid pulses)
        Haptics.impactAsync(style);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 20);
        break;
      case 'resonance':
        // Resonance pattern (triple pulse with decay)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 40);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 80);
        break;
    }
  }
  
  private selectHapticPattern(coherence: number, transverseMag: number): 'pulse' | 'wave' | 'field' | 'resonance' {
    if (coherence > 0.8 && transverseMag > 0.7) return 'resonance';
    if (coherence > 0.6) return 'field';
    if (transverseMag > 0.5) return 'wave';
    return 'pulse';
  }
  
  /**
   * AUDIO FIELD - Hydrogen resonance frequencies
   */
  private async activateAudioField(field: SensoryField): Promise<void> {
    try {
      // Create Web Audio context (if available)
      // Note: In React Native, we'll use expo-av for audio playback
      // For full Web Audio API, would need react-native-audio-toolkit
      
      // Primary resonance frequency
      await this.playResonanceFrequency(field.audioFrequency, field.harmonics);
      
      // Binaural beats for awareness entrainment
      if (field.binaural) {
        await this.playBinauralBeat(field.audioFrequency, field.binauralBeat);
      }
      
    } catch (error) {
      console.log('Audio field activation limited:', error);
    }
  }
  
  private async updateAudioField(field: SensoryField): Promise<void> {
    // Dynamically adjust frequency and volume
    // Implementation depends on audio library capabilities
  }
  
  private async playResonanceFrequency(frequency: number, harmonics: number[]): Promise<void> {
    // Note: Full implementation would use tone generation
    // Placeholder for audio synthesis
    console.log(`🎵 Resonance: ${frequency.toFixed(1)} Hz with harmonics:`, harmonics);
  }
  
  private async playBinauralBeat(baseFreq: number, beatFreq: number): Promise<void> {
    // Left ear: baseFreq
    // Right ear: baseFreq + beatFreq
    // Brain perceives: beatFreq (awareness entrainment)
    console.log(`🧠 Binaural: ${beatFreq.toFixed(1)} Hz beat`);
  }
  
  private calculateResonanceFrequency(mag: any, phase: number): number {
    // Map magnetization to audible frequency
    // Higher Mz = lower frequency (grounding)
    // Higher Mxy = higher frequency (activation)
    const transverse = Math.sqrt(mag.x ** 2 + mag.y ** 2);
    const baseFreq = this.HYDROGEN_BASE; // 432 Hz
    
    // Modulate frequency based on phase and magnetization
    const modulation = transverse * Math.sin(phase * Math.PI / 180) * 0.2;
    
    return baseFreq * (1 + modulation);
  }
  
  private generateHarmonics(fundamental: number, coherence: number): number[] {
    // More harmonics when coherent (richer sound)
    const harmonicCount = Math.floor(2 + coherence * 5); // 2-7 harmonics
    const harmonics: number[] = [];
    
    for (let i = 2; i <= harmonicCount; i++) {
      harmonics.push(fundamental * i);
    }
    
    return harmonics;
  }
  
  /**
   * VISUAL FIELD - Screen as light emitter
   */
  private activateVisualField(field: SensoryField): void {
    if (this.visualCallback) {
      this.visualCallback(field.visualIntensity, field.visualColor);
    }
  }
  
  private updateVisualField(field: SensoryField): void {
    if (this.visualCallback) {
      this.visualCallback(field.visualIntensity, field.visualColor);
    }
  }
  
  private calculateFieldColor(energy: number, phase: number): string {
    // Energy: -1 (spin-down) to +1 (spin-up)
    // Phase: 0-360 degrees
    
    // Map energy to hue (cyan → purple)
    const hue = 180 + (1 - energy) * 60; // 180° = cyan, 240° = purple
    
    // Map phase to saturation (vivid at peaks)
    const saturation = 60 + Math.abs(Math.sin(phase * Math.PI / 180)) * 40;
    
    // Fixed lightness for visibility
    const lightness = 50;
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  /**
   * Register visual field callback (called from UI layer)
   */
  setVisualCallback(callback: (intensity: number, color: string) => void): void {
    this.visualCallback = callback;
  }
  
  /**
   * PROXIMITY FIELD - Distance-based field strength
   * (Can be enhanced with camera/ML for actual distance measurement)
   */
  calculateProximityMultiplier(distance: number, field: SensoryField): number {
    // Inverse square law approximation
    if (distance <= 0) return 1;
    
    const effectiveDistance = Math.min(distance, field.fieldRadius);
    const multiplier = field.proximityStrength * (1 / (1 + effectiveDistance ** 2));
    
    return Math.max(0, Math.min(1, multiplier));
  }
  
  /**
   * Create standing wave pattern (phone + body resonance)
   */
  createStandingWavePattern(spinState: HydrogenSpinState, distance: number): {
    nodes: number[];
    antinodes: number[];
  } {
    // Calculate standing wave between phone and body
    const wavelength = distance / 2; // Half wavelength fits between
    const frequency = spinState.precessionFreq;
    
    // Node positions (destructive interference)
    const nodes: number[] = [];
    for (let i = 0; i <= 2; i++) {
      nodes.push(i * wavelength / 2);
    }
    
    // Antinode positions (constructive interference)
    const antinodes: number[] = [];
    for (let i = 0; i <= 1; i++) {
      antinodes.push((i + 0.5) * wavelength / 2);
    }
    
    return { nodes, antinodes };
  }
  
  /**
   * Generate awareness entrainment pattern
   */
  generateEntrainmentPattern(coherence: number): {
    alpha: number;    // 8-13 Hz (relaxed awareness)
    beta: number;     // 13-30 Hz (active thinking)
    theta: number;    // 4-8 Hz (deep meditation)
    gamma: number;    // 30-100 Hz (peak awareness)
  } {
    // Map coherence to brainwave state
    return {
      alpha: coherence * 10 + 8,        // Higher coherence → higher alpha
      beta: (1 - coherence) * 17 + 13,  // Lower coherence → higher beta
      theta: coherence * 4 + 4,         // Coherence enables theta
      gamma: coherence * 70 + 30        // High coherence → gamma
    };
  }
}

export default FullSensoryFieldGenerator;

