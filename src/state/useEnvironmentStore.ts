import { create } from 'zustand';

interface EnvironmentStore {
    absoluteWind: number;
    setAbsoluteWind: (absoluteWind: number) => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
    absoluteWind: 0,
    setAbsoluteWind: (absoluteWind) => set({ absoluteWind }),
}));