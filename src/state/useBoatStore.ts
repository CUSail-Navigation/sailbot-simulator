import { create } from 'zustand';

interface BoatState {
    rudderAngle: number;
    sailAngle: number;
    pose: { latitude: number; longitude: number; theta: number };
    relativeWind: number;
    rosConnected: boolean;
    setRosConnected: (connected: boolean) => void;
    setRudderAngle: (z: number) => void;
    setSailAngle: (z: number) => void;
    setPosition: (latitude: number, longitude: number) => void;
    setHeading: (theta: number) => void;
    setRelativeWind: (wind: number) => void;
}

export const useBoatStore = create<BoatState>((set) => ({
    rudderAngle: 0,
    sailAngle: 0,
    pose: { latitude: 0, longitude: 0, theta: 0 },
    relativeWind: 0,
    rosConnected: false,
    setRosConnected: (connected) => set({ rosConnected: connected }),
    setRudderAngle: (z) => set({ rudderAngle: z }),
    setSailAngle: (z) => set({ sailAngle: z }),
    setPosition: (latitude, longitude) => set((state) => ({ pose: { ...state.pose, latitude, longitude } })),
    setHeading: (theta) => set((state) => ({ pose: { ...state.pose, theta } })),
    setRelativeWind: (wind) => set({ relativeWind: wind }),
}));
