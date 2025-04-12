import { create } from 'zustand';
import { NavSatFix } from 'sensor_msgs/NavSatFix';
import { Int32 } from 'std_msgs/Int32';

interface AlgoState {
    tacking: boolean;
    tacking_point: NavSatFix | null;
    heading_dir: Int32 | null;
    curr_dest: NavSatFix | null;
    diff: Int32 | null;
    dist_to_dest: Int32 | null;
    setDistDiff: (value: Int32) => void;
    setTacking: (value: boolean) => void;
    setTackingPoint: (point: NavSatFix) => void;
    setHeadingDir: (dir: Int32) => void;
    setCurrDest: (dest: NavSatFix) => void;
    setDiff: (value: Int32) => void;
}

export const useAlgoStore = create<AlgoState>((set) => ({
    tacking: false,
    tacking_point: null,
    heading_dir: null,
    curr_dest: null,
    diff: null,
    dist_to_dest: null,
    setDistDiff: (value) => set({ dist_to_dest: value }),
    setTacking: (value) => set({ tacking: value }),
    setTackingPoint: (point) => set({ tacking_point: point }),
    setHeadingDir: (dir) => set({ heading_dir: dir }),
    setCurrDest: (dest) => set({ curr_dest: dest }),
    setDiff: (value) => set({ diff: value }),
}));

