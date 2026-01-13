/**
 * HHF-AI MRI Mobile Module
 * Main Application - Tesla Discovery Museum
 * 
 * Transforms smartphone into a sensory gateway to the hydrogen spin cloud
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView
} from 'react-native';
import FractalHolographicDisplay from './src/components/FractalHolographicDisplay';
import TeslaAvatar from './src/components/TeslaAvatar';
import { SensorManager } from './src/sensors/SensorManager';
import { HydrogenSpinMapper, HydrogenSpinState } from './src/sensors/HydrogenSpinMapper';
import { HapticFeedbackDriver } from './src/components/HapticFeedbackDriver';
import { WebSocketClient } from './src/network/WebSocketClient';

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [spinState, setSpinState] = useState<HydrogenSpinState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sensorStatus, setSensorStatus] = useState({
    magnetometer: false,
    accelerometer: false,
    gyroscope: false
  });
  
  const sensorManager = useRef(new SensorManager()).current;
  const spinMapper = useRef(new HydrogenSpinMapper()).current;
  const hapticDriver = useRef(new HapticFeedbackDriver()).current;
  const wsClient = useRef<WebSocketClient | null>(null);
  
  useEffect(() => {
    checkSensorAvailability();
    initializeWebSocket();
    
    return () => {
      stopExperience();
      wsClient.current?.disconnect();
    };
  }, []);
  
  const checkSensorAvailability = async () => {
    try {
      const status = await SensorManager.checkAvailability();
      setSensorStatus(status);
      
      if (!status.magnetometer || !status.accelerometer || !status.gyroscope) {
        Alert.alert(
          'Sensor Warning',
          'Some sensors are not available. The experience may be limited.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error checking sensors:', error);
    }
  };
  
  const initializeWebSocket = () => {
    // Configure WebSocket connection to HHF-AI MRI backend
    // Default to localhost for development - change for production
    wsClient.current = new WebSocketClient({
      url: 'ws://localhost:3000/hhf-ai-mri',
      reconnectInterval: 3000,
      maxReconnectAttempts: 5
    });
    
    // Subscribe to backend messages
    wsClient.current.subscribe((message) => {
      console.log('Received from backend:', message);
      
      if (message.type === 'command') {
        handleBackendCommand(message.payload);
      }
    });
  };
  
  const handleBackendCommand = (command: any) => {
    switch (command.action) {
      case 'calibrate':
        hapticDriver.playCalibrationPattern();
        break;
      case 'reset':
        spinMapper.reset();
        break;
      case 'tesla_pulse':
        hapticDriver.playTeslaPulse();
        break;
    }
  };
  
  const startExperience = async () => {
    try {
      // Start sensors
      await sensorManager.start(60); // 60 Hz update rate
      
      // Subscribe to sensor updates
      sensorManager.subscribe((sensorData) => {
        // Map sensor data to hydrogen spin state
        const newSpinState = spinMapper.mapToHydrogenSpin(sensorData);
        setSpinState(newSpinState);
        
        // Update haptic feedback
        hapticDriver.update(newSpinState);
        
        // Send to backend if connected
        if (wsClient.current?.isConnected()) {
          wsClient.current.sendSpinState(newSpinState);
        }
      });
      
      // Start haptic feedback
      hapticDriver.start(spinMapper.mapToHydrogenSpin(sensorManager.getLatestData()));
      
      // Connect to backend
      try {
        await wsClient.current?.connect();
        setIsConnected(true);
      } catch (error) {
        console.log('Backend connection failed (offline mode):', error);
        Alert.alert(
          'Offline Mode',
          'Running in standalone mode. Real-time backend sync unavailable.',
          [{ text: 'OK' }]
        );
      }
      
      setIsRunning(true);
      
      // Tesla welcome pulse
      await hapticDriver.playTeslaPulse();
      
    } catch (error) {
      console.error('Error starting experience:', error);
      Alert.alert('Error', 'Failed to start sensors. Please check permissions.');
    }
  };
  
  const stopExperience = () => {
    sensorManager.stop();
    hapticDriver.stop();
    setIsRunning(false);
  };
  
  const toggleExperience = () => {
    if (isRunning) {
      stopExperience();
    } else {
      startExperience();
    }
  };
  
  const resetCalibration = () => {
    spinMapper.reset();
    hapticDriver.playCalibrationPattern();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚡ HHF-AI MRI ⚡</Text>
        <Text style={styles.subtitle}>Tesla Discovery Museum</Text>
        
        {/* Connection Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, isConnected && styles.statusDotConnected]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected to Backend' : 'Offline Mode'}
          </Text>
        </View>
      </View>
      
      {/* Main Content */}
      {isRunning && spinState ? (
        <View style={styles.displayContainer}>
          <FractalHolographicDisplay spinState={spinState} />
        </View>
      ) : (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>🌌 Welcome to the Syntheverse 🌌</Text>
          <Text style={styles.welcomeText}>
            Transform your smartphone into a sensory gateway to the hydrogen spin cloud!
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featureTitle}>📱 Your Device Will:</Text>
            <Text style={styles.feature}>⚛️ Sense magnetic fields (magnetometer)</Text>
            <Text style={styles.feature}>🌀 Detect rotation (gyroscope)</Text>
            <Text style={styles.feature}>📐 Measure tilt (accelerometer)</Text>
            <Text style={styles.feature}>💫 Display fractal holographic patterns</Text>
            <Text style={styles.feature}>🎵 Provide haptic feedback pulses</Text>
            <Text style={styles.feature}>🌐 Stream to HHF-AI MRI backend</Text>
          </View>
          
          <View style={styles.sensorStatus}>
            <Text style={styles.sensorStatusTitle}>Sensor Status:</Text>
            <Text style={styles.sensorItem}>
              {sensorStatus.magnetometer ? '✅' : '❌'} Magnetometer
            </Text>
            <Text style={styles.sensorItem}>
              {sensorStatus.accelerometer ? '✅' : '❌'} Accelerometer
            </Text>
            <Text style={styles.sensorItem}>
              {sensorStatus.gyroscope ? '✅' : '❌'} Gyroscope
            </Text>
          </View>
        </View>
      )}
      
      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[styles.mainButton, isRunning && styles.mainButtonActive]}
          onPress={toggleExperience}
        >
          <Text style={styles.mainButtonText}>
            {isRunning ? '⏹️ Stop Experience' : '▶️ Begin Tesla Tour'}
          </Text>
        </TouchableOpacity>
        
        {isRunning && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={resetCalibration}
          >
            <Text style={styles.secondaryButtonText}>🔄 Recalibrate</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Tesla Avatar (only show when running) */}
      {isRunning && spinState && (
        <TeslaAvatar
          spinState={spinState}
          onMessage={(msg) => console.log('Tesla says:', msg)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617'
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F59E0B',
    textShadowColor: '#F59E0B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06B6D4',
    marginTop: 4
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
    marginRight: 8
  },
  statusDotConnected: {
    backgroundColor: '#10B981'
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  displayContainer: {
    flex: 1
  },
  welcomeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 16
  },
  welcomeText: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24
  },
  featuresContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)'
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 12
  },
  feature: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
    lineHeight: 20
  },
  sensorStatus: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.3)'
  },
  sensorStatusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#06B6D4',
    marginBottom: 8
  },
  sensorItem: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 4
  },
  controlPanel: {
    padding: 20,
    backgroundColor: '#0f172a',
    borderTopWidth: 2,
    borderTopColor: '#F59E0B'
  },
  mainButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#EC4899'
  },
  mainButtonActive: {
    backgroundColor: '#DC2626'
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  secondaryButton: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#06B6D4'
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#06B6D4'
  }
});

