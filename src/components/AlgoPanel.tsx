import { useAlgoStore } from "../state/useAlgoStore";

export function AlgoPanel() {
    const { tacking, tacking_point, heading_dir, curr_dest, diff } = useAlgoStore();

    return (
        <div className="p-4 space-y-4 text-gray-700 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-gray-800">🧠 Algo Debug</h2>

            <div className="mb-4">
                <strong className="font-medium">Tacking:</strong> {tacking ? "Yes" : "No"}
            </div>

            <div className="mb-4">
                <strong className="font-medium">Tacking Point:</strong>
                <div>Latitude: {tacking_point?.latitude || "N/A"}</div>
                <div>Longitude: {tacking_point?.longitude || "N/A"}</div>
            </div>

            <div className="mb-4">
                <strong className="font-medium">Heading Direction:</strong> {heading_dir?.data || "N/A"}°
            </div>

            <div className="mb-4">
                <strong className="font-medium">Current Destination:</strong>
                <div>Latitude: {curr_dest?.latitude || "N/A"}</div>
                <div>Longitude: {curr_dest?.longitude || "N/A"}</div>
            </div>

            <div className="mb-4">
                <strong className="font-medium">Difference:</strong> {diff?.data || "N/A"}
            </div>
        </div>
    );
};
