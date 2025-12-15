import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows, Line } from '@react-three/drei';
import { ThermopileSensor } from './ThermopileSensor';
import { HeatSource } from './HeatSource';

interface SceneProps {
  objectTemp: number;
  distance: number;
}

export const SimulationScene: React.FC<SceneProps> = ({ objectTemp, distance }) => {
  
  // Calculate line end point based on distance
  // Sensor is at x = -3. Heat Source is at x = distance - 3.
  const sourceX = distance - 3;

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 45 }} shadows>
      <color attach="background" args={['#0f172a']} />
      
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      
      {/* Studio Environment */}
      <Environment preset="city" />

      {/* The Experiment Setup */}
      <group position={[0, 1, 0]}>
        <ThermopileSensor />
        <HeatSource temperature={objectTemp} distance={distance} />
        
        {/* Visual Raycast Line indicating measurement */}
        <Line 
            points={[[-2.5, 0, 0], [sourceX - 0.8, 0, 0]]} 
            color={objectTemp > 100 ? "red" : "gray"} 
            opacity={0.5} 
            transparent 
            lineWidth={2} 
            dashed={true}
        />
      </group>

      {/* Floor */}
      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        sectionColor="#475569" 
        cellColor="#1e293b" 
        position={[0, 0, 0]}
      />
      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
    </Canvas>
  );
};