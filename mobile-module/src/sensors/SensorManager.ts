/**
 * Sensor Manager
 * Manages all device sensors and provides unified sensor data stream
 */

import {
  Magnetometer,
  Accelerometer,
  Gyroscope,
  MagnetometerMeasurement,
  AccelerometerMeasurement,
  GyroscopeMeasurement
} from 'expo-sensors';
import { SensorData, Vector3D } from './HydrogenSpinMapper';

export type SensorCallback = (data: SensorData) => void;

export class SensorManager {
  private magnetometerSubscription: any = null;
  private accelerometerSubscription: any = null;
  private gyroscopeSubscription: any = null;
  
  private latestMagnetometer: Vector3D = { x: 0, y: 0, z: 0 };
  private latestAccelerometer: Vector3D = { x: 0, y: 0, z: 9.81 };
  private latestGyroscope: Vector3D = { x: 0, y: 0, z: 0 };
  
  private callbacks: Set<SensorCallback> = new Set();
  private updateInterval: any = null;
  
  /**
   * Start all sensors
   */
  async start(updateRate: number = 60): Promise<void> {
    try {
      // Set update intervals (Hz)
      Magnetometer.setUpdateInterval(1000 / updateRate);
      Accelerometer.setUpdateInterval(1000 / updateRate);
      Gyroscope.setUpdateInterval(1000 / updateRate);
      
      // Subscribe to magnetometer
      this.magnetometerSubscription = Magnetometer.addListener(
        (data: MagnetometerMeasurement) => {
          this.latestMagnetometer = { x: data.x, y: data.y, z: data.z };
        }
      );
      
      // Subscribe to accelerometer
      this.accelerometerSubscription = Accelerometer.addListener(
        (data: AccelerometerMeasurement) => {
          this.latestAccelerometer = { x: data.x, y: data.y, z: data.z };
        }
      );
      
      // Subscribe to gyroscope
      this.gyroscopeSubscription = Gyroscope.addListener(
        (data: GyroscopeMeasurement) => {
          this.latestGyroscope = { x: data.x, y: data.y, z: data.z };
        }
      );
      
      // Start update loop
      this.updateInterval = setInterval(() => {
        this.notifyCallbacks();
      }, 1000 / updateRate);
      
      console.log('✅ All sensors started successfully');
    } catch (error) {
      console.error('❌ Error starting sensors:', error);
      throw error;
    }
  }
  
  /**
   * Stop all sensors
   */
  stop(): void {
    if (this.magnetometerSubscription) {
      this.magnetometerSubscription.remove();
      this.magnetometerSubscription = null;
    }
    
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove();
      this.accelerometerSubscription = null;
    }
    
    if (this.gyroscopeSubscription) {
      this.gyroscopeSubscription.remove();
      this.gyroscopeSubscription = null;
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('🛑 All sensors stopped');
  }
  
  /**
   * Register callback for sensor updates
   */
  subscribe(callback: SensorCallback): () => void {
    this.callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }
  
  /**
   * Notify all callbacks with latest sensor data
   */
  private notifyCallbacks(): void {
    const sensorData: SensorData = {
      magnetometer: { ...this.latestMagnetometer },
      accelerometer: { ...this.latestAccelerometer },
      gyroscope: { ...this.latestGyroscope },
      timestamp: Date.now()
    };
    
    this.callbacks.forEach(callback => {
      try {
        callback(sensorData);
      } catch (error) {
        console.error('Error in sensor callback:', error);
      }
    });
  }
  
  /**
   * Get latest sensor readings
   */
  getLatestData(): SensorData {
    return {
      magnetometer: { ...this.latestMagnetometer },
      accelerometer: { ...this.latestAccelerometer },
      gyroscope: { ...this.latestGyroscope },
      timestamp: Date.now()
    };
  }
  
  /**
   * Check sensor availability
   */
  static async checkAvailability(): Promise<{
    magnetometer: boolean;
    accelerometer: boolean;
    gyroscope: boolean;
  }> {
    const [mag, accel, gyro] = await Promise.all([
      Magnetometer.isAvailableAsync(),
      Accelerometer.isAvailableAsync(),
      Gyroscope.isAvailableAsync()
    ]);
    
    return {
      magnetometer: mag,
      accelerometer: accel,
      gyroscope: gyro
    };
  }
}

export default SensorManager;



