import { useAlgoStore } from "../state/useAlgoStore";

export function AlgoPanel() {
    const { tacking, tacking_point, heading_dir, curr_dest, diff, dist_to_dest } = useAlgoStore();

    return (
        <div className="p-4 space-y-4 text-gray-700 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-gray-800">🧠 Algo Debug</h2>

            <div className="mb-4">
                <strong className="font-medium">Tacking:</strong> {tacking ? "Yes" : "No"}
            </div>

            {/* <div className="mb-4">
                <strong className="font-medium">Tacking Point:</strong>
                <div>Latitude: {tacking_point?.latitude}</div>
                <div>Longitude: {tacking_point?.longitude}</div>
            </div> */}

            <div className="mb-4">
                <strong className="font-medium">Current Destination:</strong>
                <div>Latitude: {curr_dest?.latitude}</div>
                <div>Longitude: {curr_dest?.longitude}</div>
            </div>

            <div className="mb-4">
                <strong className="font-medium">Angle Difference:</strong> {diff?.data}
            </div>

            <div className="mb-4">
                <strong className="font-medium">Distance Difference:</strong> {dist_to_dest?.data}
            </div>
        </div>
    );
};
