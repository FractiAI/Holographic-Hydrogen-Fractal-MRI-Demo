/**
 * Fractal Holographic Display
 * Real-time visualization of hydrogen spin cloud
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { HydrogenSpinState, Vector3D } from '../sensors/HydrogenSpinMapper';

interface FractalHolographicDisplayProps {
  spinState: HydrogenSpinState;
  width?: number;
  height?: number;
}

const FractalHolographicDisplay: React.FC<FractalHolographicDisplayProps> = ({
  spinState,
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height * 0.6
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Generate fractal pattern based on spin state
  const generateFractalPoints = (): Vector3D[] => {
    const points: Vector3D[] = [];
    const { magnetization, phase, coherence } = spinState;
    
    // Golden angle for optimal distribution
    const goldenAngle = 137.5;
    const depth = 50 + coherence * 50; // More coherence = more points
    
    for (let i = 0; i < depth; i++) {
      const angle = (phase + i * goldenAngle) * Math.PI / 180;
      const radius = Math.sqrt(i) * 5 * (0.5 + coherence * 0.5);
      
      // Project 3D spin onto 2D display
      const x = centerX + radius * Math.cos(angle) * (1 + magnetization.x * 0.5);
      const y = centerY + radius * Math.sin(angle) * (1 + magnetization.y * 0.5);
      const z = magnetization.z * i * 0.1;
      
      points.push({ x, y, z });
    }
    
    return points;
  };
  
  // Generate hydrogen atoms visualization
  const generateHydrogenAtoms = (): React.ReactNode[] => {
    const fractalPoints = generateFractalPoints();
    const { coherence, energy } = spinState;
    
    return fractalPoints.map((point, i) => {
      // Color based on energy and coherence
      const hue = 180 + energy * 60; // Cyan to purple
      const saturation = 70 + coherence * 30;
      const lightness = 50 + point.z * 0.5;
      const opacity = coherence * (1 - i / fractalPoints.length * 0.7);
      
      // Size based on depth
      const size = 3 + point.z * 0.1;
      
      return (
        <Circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={size}
          fill={`hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`}
          opacity={opacity}
        />
      );
    });
  };
  
  // Generate spin vector arrow
  const generateSpinVector = () => {
    const { magnetization } = spinState;
    const scale = 100;
    
    const endX = centerX + magnetization.x * scale;
    const endY = centerY - magnetization.y * scale; // Flip Y for screen coords
    const endZ = magnetization.z;
    
    // Arrowhead
    const arrowAngle = Math.atan2(endY - centerY, endX - centerX);
    const arrowLength = 15;
    const arrowAngle1 = arrowAngle + Math.PI * 0.85;
    const arrowAngle2 = arrowAngle - Math.PI * 0.85;
    
    return (
      <>
        <Line
          x1={centerX}
          y1={centerY}
          x2={endX}
          y2={endY}
          stroke={`hsl(${180 + endZ * 60}, 80%, 60%)`}
          strokeWidth={4}
          opacity={0.9}
        />
        <Path
          d={`M ${endX} ${endY} L ${endX + Math.cos(arrowAngle1) * arrowLength} ${endY + Math.sin(arrowAngle1) * arrowLength} L ${endX + Math.cos(arrowAngle2) * arrowLength} ${endY + Math.sin(arrowAngle2) * arrowLength} Z`}
          fill={`hsl(${180 + endZ * 60}, 80%, 60%)`}
          opacity={0.9}
        />
      </>
    );
  };
  
  // Generate coherence rings
  const generateCoherenceRings = () => {
    const { coherence, precessionFreq } = spinState;
    const rings = [];
    const numRings = 5;
    
    for (let i = 1; i <= numRings; i++) {
      const radius = (i / numRings) * Math.min(width, height) * 0.4;
      const opacity = coherence * (1 - i / numRings * 0.6);
      const strokeWidth = coherence * 2;
      
      rings.push(
        <Circle
          key={`ring-${i}`}
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={`hsl(${180 + precessionFreq * 2}, 70%, 50%)`}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    }
    
    return rings;
  };
  
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          <RadialGradient id="bgGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#020617" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#0f172a" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#1e293b" stopOpacity="0.5" />
          </RadialGradient>
        </Defs>
        
        {/* Background */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={Math.min(width, height) / 2}
          fill="url(#bgGradient)"
        />
        
        {/* Coherence rings */}
        {generateCoherenceRings()}
        
        {/* Fractal hydrogen cloud */}
        {generateHydrogenAtoms()}
        
        {/* Magnetization vector */}
        {generateSpinVector()}
        
        {/* Central hydrogen nucleus */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={8}
          fill="#F59E0B"
          opacity={0.9}
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={12}
          fill="none"
          stroke="#EC4899"
          strokeWidth={2}
          opacity={0.6}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  svg: {
    backgroundColor: 'transparent',
  }
});

export default FractalHolographicDisplay;

