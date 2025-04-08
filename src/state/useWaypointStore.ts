import { create } from 'zustand';

interface WaypointStore {
    waypoints: Array<{ latitude: number; longitude: number; }>;
    setWaypoints: (waypoints: Array<{ latitude: number; longitude: number }>) => void;
}

export const useWaypointStore = create<WaypointStore>((set) => ({
    waypoints: [],
    setWaypoints: (waypoints) => set({ waypoints }),
}));
