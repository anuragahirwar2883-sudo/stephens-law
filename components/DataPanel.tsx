import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ReadingLog } from '../types';
import { Thermometer, Ruler, Activity, Info } from 'lucide-react';

interface DataPanelProps {
  objectTemp: number;
  setObjectTemp: (val: number) => void;
  distance: number;
  setDistance: (val: number) => void;
  sensorVoltage: number;
  logs: ReadingLog[];
}

export const DataPanel: React.FC<DataPanelProps> = ({
  objectTemp,
  setObjectTemp,
  distance,
  setDistance,
  sensorVoltage,
  logs
}) => {
  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-96 bg-slate-900/95 border-l border-slate-700 backdrop-blur-md p-6 flex flex-col gap-6 overflow-y-auto text-slate-100 shadow-2xl">
      
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-blue-400" />
          Sensor Control
        </h2>
        <p className="text-xs text-slate-400 mt-1">Thermopile Simulation Output</p>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        
        {/* Temperature Control */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-400" />
              Source Temp
            </label>
            <span className="text-sm font-bold text-red-400">{objectTemp}°C</span>
          </div>
          <input
            type="range"
            min="25"
            max="1500"
            step="5"
            value={objectTemp}
            onChange={(e) => setObjectTemp(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>25°C</span>
            <span>1500°C</span>
          </div>
        </div>

        {/* Distance Control */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-400" />
              Distance
            </label>
            <span className="text-sm font-bold text-emerald-400">{distance.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.5m</span>
            <span>10m</span>
          </div>
        </div>

      </div>

      {/* Digital Readout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs uppercase font-semibold">Sensor Voltage</span>
            <span className="text-2xl font-mono text-blue-300 font-bold mt-1">
                {sensorVoltage.toFixed(3)} <span className="text-sm text-slate-500">mV</span>
            </span>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs uppercase font-semibold">Infrared Flux</span>
            <span className="text-xl font-mono text-orange-300 font-bold mt-1">
                {(sensorVoltage * 12.5).toFixed(1)} <span className="text-sm text-slate-500">W/m²</span>
            </span>
        </div>
      </div>

      {/* Graph */}
      <div className="flex-grow min-h-[200px] bg-slate-800 rounded-lg border border-slate-700 p-2 flex flex-col">
        <h3 className="text-xs font-semibold text-slate-400 mb-2 px-2 uppercase tracking-wider">Voltage vs Time</h3>
        <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 'auto']} tick={{fontSize: 10, fill: '#94a3b8'}} width={30} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', fontSize: '12px' }} 
                    itemStyle={{ color: '#60a5fa' }}
                    labelStyle={{ display: 'none' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="voltage" 
                    stroke="#60a5fa" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
        <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
            <p className="text-xs text-blue-200 leading-relaxed">
                <strong>Physics Note:</strong> Thermopiles measure temperature difference. The output voltage <em className="font-serif">V</em> is roughly proportional to <em className="font-serif">(T<sub>obj</sub>⁴ - T<sub>amb</sub>⁴)</em>. 
                Distance reduces the reading as the object fills less of the sensor's field of view (FOV).
            </p>
        </div>
      </div>

    </div>
  );
};