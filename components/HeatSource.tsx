import React, { useRef, useMemo } from 'react';
import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeatSourceProps {
  temperature: number; // Celsius
  distance: number;
}

export const HeatSource: React.FC<HeatSourceProps> = ({ temperature, distance }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate color based on Blackbody radiation approximation (simplified)
  const color = useMemo(() => {
    // Clamp visualization:
    // < 100C: Dark Red/Black
    // 500C: Red
    // 1000C: Orange
    // 2000C+: Yellow/White
    
    if (temperature < 50) return new THREE.Color('#1a0505');
    if (temperature < 200) return new THREE.Color('#500000');
    if (temperature < 500) return new THREE.Color('#ff0000');
    if (temperature < 800) return new THREE.Color('#ff4500');
    if (temperature < 1200) return new THREE.Color('#ff8c00');
    return new THREE.Color('#ffff00');
  }, [temperature]);

  const emissiveIntensity = useMemo(() => {
    return Math.min(2, Math.max(0.2, temperature / 1000));
  }, [temperature]);

  useFrame((state, delta) => {
    if (meshRef.current) {
        // Subtle pulsing effect for heat
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.02);
    }
  });

  return (
    <group position={[distance - 3, 0, 0]}> 
      {/* Offset by -3 because sensor is at -3 */}
      <Sphere ref={meshRef} args={[0.8, 32, 32]}>
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
        />
      </Sphere>
      
      {/* Heat Haze / Glow Halo */}
      <Sphere args={[1.2, 16, 16]}>
        <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.1 * emissiveIntensity} 
            side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};