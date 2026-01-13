/**
 * Haptic Feedback Driver
 * Synchronized haptic pulses with hydrogen spin phase
 */

import * as Haptics from 'expo-haptics';
import { HydrogenSpinState } from '../sensors/HydrogenSpinMapper';

export interface HapticPattern {
  type: 'impact' | 'notification' | 'selection';
  intensity: 'light' | 'medium' | 'heavy';
  interval?: number; // ms between pulses
}

export class HapticFeedbackDriver {
  private isActive = false;
  private intervalHandle: any = null;
  private lastPhase = 0;
  
  /**
   * Start haptic feedback synchronized with spin state
   */
  start(spinState: HydrogenSpinState): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.provideFeedback(spinState);
  }
  
  /**
   * Stop haptic feedback
   */
  stop(): void {
    this.isActive = false;
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }
  
  /**
   * Update haptic feedback based on current spin state
   */
  update(spinState: HydrogenSpinState): void {
    if (!this.isActive) return;
    this.provideFeedback(spinState);
  }
  
  /**
   * Provide haptic feedback based on spin parameters
   */
  private provideFeedback(spinState: HydrogenSpinState): void {
    const { phase, coherence, precessionFreq, magnetization } = spinState;
    
    // Trigger pulse at specific phase angles (like MRI signal peaks)
    const phaseThreshold = 10; // degrees
    const phaseDiff = Math.abs(phase - this.lastPhase);
    
    // Check if we've crossed a phase boundary
    const shouldPulse = 
      (phase < phaseThreshold && this.lastPhase > 360 - phaseThreshold) ||
      (phase > 360 - phaseThreshold && this.lastPhase < phaseThreshold) ||
      (Math.abs(phase - 0) < phaseThreshold && Math.abs(this.lastPhase - 0) > phaseThreshold) ||
      (Math.abs(phase - 90) < phaseThreshold && Math.abs(this.lastPhase - 90) > phaseThreshold) ||
      (Math.abs(phase - 180) < phaseThreshold && Math.abs(this.lastPhase - 180) > phaseThreshold) ||
      (Math.abs(phase - 270) < phaseThreshold && Math.abs(this.lastPhase - 270) > phaseThreshold);
    
    if (shouldPulse) {
      // Intensity based on coherence and transverse magnetization
      const transverseMag = Math.sqrt(magnetization.x ** 2 + magnetization.y ** 2);
      const intensity = transverseMag * coherence;
      
      // Select haptic type based on intensity
      if (intensity > 0.7) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (intensity > 0.4) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (intensity > 0.1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    
    this.lastPhase = phase;
  }
  
  /**
   * Trigger single impact pulse
   */
  async triggerImpact(intensity: 'light' | 'medium' | 'heavy'): Promise<void> {
    const style = 
      intensity === 'light' ? Haptics.ImpactFeedbackStyle.Light :
      intensity === 'medium' ? Haptics.ImpactFeedbackStyle.Medium :
      Haptics.ImpactFeedbackStyle.Heavy;
    
    await Haptics.impactAsync(style);
  }
  
  /**
   * Trigger notification pattern
   */
  async triggerNotification(type: 'success' | 'warning' | 'error'): Promise<void> {
    const feedbackType =
      type === 'success' ? Haptics.NotificationFeedbackType.Success :
      type === 'warning' ? Haptics.NotificationFeedbackType.Warning :
      Haptics.NotificationFeedbackType.Error;
    
    await Haptics.notificationAsync(feedbackType);
  }
  
  /**
   * Trigger selection feedback
   */
  async triggerSelection(): Promise<void> {
    await Haptics.selectionAsync();
  }
  
  /**
   * Custom pulse pattern for calibration
   */
  async playCalibrationPattern(): Promise<void> {
    const pattern = [
      { intensity: 'light', delay: 0 },
      { intensity: 'medium', delay: 200 },
      { intensity: 'heavy', delay: 400 },
      { intensity: 'medium', delay: 600 },
      { intensity: 'light', delay: 800 }
    ];
    
    for (const pulse of pattern) {
      await new Promise(resolve => setTimeout(resolve, pulse.delay));
      await this.triggerImpact(pulse.intensity as any);
    }
  }
  
  /**
   * Tesla's signature pulse (⚡)
   */
  async playTeslaPulse(): Promise<void> {
    // Energetic double-pulse pattern
    await this.triggerImpact('heavy');
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.triggerImpact('heavy');
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.triggerImpact('medium');
  }
}

export default HapticFeedbackDriver;



