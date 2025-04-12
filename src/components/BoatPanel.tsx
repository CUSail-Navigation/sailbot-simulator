import { useBoatStore } from "../state/useBoatStore";

export function BoatPanel() {
    const { rudderAngle, sailAngle, pose, relativeWind, rosConnected } = useBoatStore();

    return (
        <div className="p-4 space-y-4 text-gray-700 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-gray-800">⛵ Boat State</h2>

            <div className="mb-4">
                <strong className="font-medium">Sail Angle:</strong> {sailAngle || "N/A"}
            </div>

            <div className="mb-4">
                <strong className="font-medium">Rudder Angle:</strong> {rudderAngle || "N/A"}
            </div>

            <div className="mb-4">
                <strong className="font-medium">Location:</strong>
                <div>Latitude: {pose?.latitude || "N/A"}</div>
                <div>Longitude: {pose?.longitude || "N/A"}</div>
            </div>

            <div className="mb-4">
                <strong className="font-medium">Relative Wind:</strong> {relativeWind || "N/A"}°
            </div>

            <div className="mb-4">
                <strong className="font-medium">Ros Connected:</strong> {rosConnected || "N/A"}
            </div>
        </div>
    );
};
