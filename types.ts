export interface SimulationState {
  objectTemp: number; // Celsius
  ambientTemp: number; // Celsius
  distance: number; // Meters (arbitrary units in 3D space)
  sensorVoltage: number; // Simulated mV
}

export interface ReadingLog {
  time: string;
  temp: number;
  voltage: number;
}
