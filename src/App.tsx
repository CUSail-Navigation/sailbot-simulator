import { useState, useRef, useEffect } from 'react';
import './ros/';
import { startROSSubscriptions } from './ros/subscribers';
import { SensorPanel } from './components/SensorPanel';
import { BoatCanvas } from './components/BoatCanvas';
import { WaypointQueue } from './components/WaypointQueue';
import { AlgoPanel } from './components/AlgoPanel';

export default function App() {
  useEffect(() => {
    startROSSubscriptions(); // 🔁 listen to /rudder_angle and /sail_angle
  }, []);

  return (
    <div className="flex h-screen w-screen bg-blue-100 font-sans overflow-hidden">
      {/* Left Column */}
      <div className="flex-[3] bg-white shadow-md p-6 space-y-6">
        <SensorPanel />
        <WaypointQueue />
      </div>

      {/* Center Canvas */}
      <div className="flex-[6] flex items-center justify-center">
        <BoatCanvas />
      </div>

      {/* Right Column */}
      <div className="flex-[3] bg-white shadow-md p-6 space-y-6">
        <AlgoPanel />
      </div>
    </div>
  );
}
