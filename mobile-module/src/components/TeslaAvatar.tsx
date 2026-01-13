/**
 * Tesla Avatar Component
 * Animated Nikola Tesla guide for the HHF-AI MRI experience
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { HydrogenSpinState } from '../sensors/HydrogenSpinMapper';

interface TeslaAvatarProps {
  spinState?: HydrogenSpinState;
  onMessage?: (message: string) => void;
}

const TeslaAvatar: React.FC<TeslaAvatarProps> = ({ spinState, onMessage }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const glowAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  
  const teslaMessages = [
    "⚡ Greetings, explorer! I am Nikola Tesla!",
    "Hold your device steady to calibrate...",
    "Excellent! The hydrogen spins are aligning!",
    "See the fractal patterns? That's COHERENCE!",
    "Tilt your device to change the spin angle!",
    "Feel the haptic pulses? That's the Larmor frequency!",
    "The Syntheverse awaits your discovery!",
    "Energy and awareness are one!",
    "You're now imaging the quantum realm!",
    "Magnificent! The future is NOW!"
  ];
  
  useEffect(() => {
    // Pulsing glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);
  
  useEffect(() => {
    // Auto-cycle messages every 8 seconds
    const interval = setInterval(() => {
      if (isActive) {
        setCurrentMessage(prev => (prev + 1) % teslaMessages.length);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  useEffect(() => {
    // Respond to spin state changes
    if (spinState) {
      const { coherence, spinAngle } = spinState;
      
      // Tesla comments on specific conditions
      if (coherence > 0.8 && currentMessage < 3) {
        setCurrentMessage(3); // High coherence message
      } else if (spinAngle > 70 && spinAngle < 110) {
        setCurrentMessage(4); // 90° pulse detected
      }
    }
  }, [spinState]);
  
  const handleTeslaClick = () => {
    setCurrentMessage((currentMessage + 1) % teslaMessages.length);
    onMessage?.(teslaMessages[currentMessage]);
  };
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1]
  });
  
  return (
    <View style={styles.container}>
      {/* Tesla's Speech Bubble */}
      <Animated.View
        style={[
          styles.speechBubble,
          {
            opacity: glowOpacity,
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <Text style={styles.message}>{teslaMessages[currentMessage]}</Text>
        <View style={styles.bubbleTail} />
      </Animated.View>
      
      {/* Tesla Avatar */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={handleTeslaClick}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.avatar,
            {
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <Text style={styles.avatarEmoji}>⚡</Text>
        </Animated.View>
        
        {/* Electric aura */}
        <Animated.View
          style={[
            styles.aura,
            {
              opacity: glowOpacity
            }
          ]}
        />
      </TouchableOpacity>
      
      {/* Status indicators */}
      {spinState && (
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Coherence</Text>
            <View style={styles.statusBarContainer}>
              <View
                style={[
                  styles.statusBarFill,
                  {
                    width: `${spinState.coherence * 100}%`,
                    backgroundColor: spinState.coherence > 0.7 ? '#10B981' : '#F59E0B'
                  }
                ]}
              />
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Spin Angle</Text>
            <Text style={styles.statusValue}>
              {spinState.spinAngle.toFixed(1)}°
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Phase</Text>
            <Text style={styles.statusValue}>
              {spinState.phase.toFixed(0)}°
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
    zIndex: 1000
  },
  speechBubble: {
    backgroundColor: 'rgba(245, 158, 11, 0.95)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 3,
    borderColor: '#EC4899',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(245, 158, 11, 0.95)'
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10
  },
  avatarEmoji: {
    fontSize: 48,
    textShadowColor: '#F59E0B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20
  },
  aura: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F59E0B',
    opacity: 0.3
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 20
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4
  },
  statusLabel: {
    color: '#06B6D4',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  statusValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  statusBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  statusBarFill: {
    height: '100%',
    borderRadius: 4
  }
});

export default TeslaAvatar;

