import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SimulationScene } from './components/SimulationScene';
import { DataPanel } from './components/DataPanel';
import { ReadingLog } from './types';

// Physical constants (Simplified for simulation)
const STEFAN_BOLTZMANN_CONST = 5.67e-8;
const AMBIENT_TEMP = 25; // Celsius

const App: React.FC = () => {
  // State
  const [objectTemp, setObjectTemp] = useState<number>(100); // Start at boiling
  const [distance, setDistance] = useState<number>(2); // 2 meters
  const [sensorVoltage, setSensorVoltage] = useState<number>(0);
  const [logs, setLogs] = useState<ReadingLog[]>([]);

  // Simulation Loop ref to manage update frequency
  const lastUpdate = useRef<number>(Date.now());

  // Calculate Sensor Reading (Physics Logic)
  const calculateReading = useCallback(() => {
    // 1. Convert to Kelvin
    const tObjK = objectTemp + 273.15;
    const tAmbK = AMBIENT_TEMP + 273.15;

    // 2. Radiant Power Difference (Stefan-Boltzmann)
    // P ~ (T_obj^4 - T_amb^4)
    const powerDiff = Math.pow(tObjK, 4) - Math.pow(tAmbK, 4);

    // 3. Distance Factor (Inverse Square Law approximation constrained by FOV)
    // In a real thermopile, if the object fills the FOV, distance doesn't matter much.
    // If it's a small spot source (like our sphere), it falls off with distance^2.
    // We'll simulate a spot source behavior for better interactivity.
    const distanceFactor = 1 / (distance * distance);

    // 4. Sensitivity Coefficient (Arbitrary to make numbers look nice in mV)
    const sensitivity = 1.5e-10; 
    
    // Calculate raw voltage
    let v = powerDiff * distanceFactor * sensitivity;
    
    // Add some noise for realism
    v = v + (Math.random() * 0.05 * v);

    return Math.max(0, v);
  }, [objectTemp, distance]);

  // Update Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newVoltage = calculateReading();
      setSensorVoltage(newVoltage);

      // Log data for graph every 500ms
      if (now - lastUpdate.current > 200) {
        setLogs(prev => {
          const newLogs = [...prev, {
            time: new Date().toLocaleTimeString(),
            temp: objectTemp,
            voltage: newVoltage
          }];
          // Keep last 50 data points
          return newLogs.slice(-50);
        });
        lastUpdate.current = now;
      }

    }, 50); // High frequency update for voltage display

    return () => clearInterval(interval);
  }, [calculateReading, objectTemp]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* 3D Viewport */}
      <div className="absolute inset-0 z-0">
        <SimulationScene 
            objectTemp={objectTemp} 
            distance={distance} 
        />
      </div>

      {/* Overlay UI (Non-intrusive title) */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
          VR Thermopile <span className="text-blue-400">Lab</span>
        </h1>
        <p className="text-slate-300 text-sm drop-shadow-md">Interactive Infrared Simulation</p>
      </div>

      {/* Control Panel */}
      <div className="z-20 relative h-full pointer-events-none">
        <div className="pointer-events-auto h-full">
            <DataPanel 
                objectTemp={objectTemp}
                setObjectTemp={setObjectTemp}
                distance={distance}
                setDistance={setDistance}
                sensorVoltage={sensorVoltage}
                logs={logs}
            />
        </div>
      </div>
    </div>
  );
};

export default App;