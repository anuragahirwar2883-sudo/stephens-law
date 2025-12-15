import React from 'react';
import { Cylinder, Box } from '@react-three/drei';

export const ThermopileSensor: React.FC = () => {
  return (
    <group position={[-3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
      {/* Sensor Body */}
      <Cylinder args={[0.5, 0.5, 1, 32]} material-color="#334155" />
      
      {/* Sensor Lens */}
      <Cylinder position={[0, 0.51, 0]} args={[0.3, 0.3, 0.1, 32]} material-color="#0ea5e9" />
      
      {/* Mounting Base */}
      <Box position={[0, -0.6, 0]} args={[0.8, 0.2, 0.8]} material-color="#1e293b" />
      
      {/* Wire connector visualization */}
      <Box position={[0.4, -0.4, 0]} args={[0.2, 0.2, 0.1]} material-color="#fbbf24" />
    </group>
  );
};