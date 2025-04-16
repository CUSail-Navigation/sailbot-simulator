import { useBoatStore } from "../state/useBoatStore";

export function BoatPanel() {
    const { rudderAngle, sailAngle, pose, relativeWind, rosConnected } = useBoatStore();

    return (
        <div className="p-4 space-y-4 text-gray-700 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-gray-800">⛵ Boat State</h2>

            <div className="mb-4">
                <strong className="font-medium">Sail Angle:</strong> {sailAngle}
            </div>

            <div className="mb-4">
                <strong className="font-medium">Rudder Angle:</strong> {rudderAngle}
            </div>

            <div className="mb-4">
                <strong className="font-medium">Location:</strong>
                <div>Latitude: {pose?.latitude}</div>
                <div>Longitude: {pose?.longitude}</div>
            </div>

            <div className="mb-4">
                <strong className="font-medium">Heading:</strong> {pose?.theta}°
            </div>

            <div className="mb-4">
                <strong className="font-medium">Relative Wind:</strong> {relativeWind}°
            </div>

            <div className="mb-4">
                <strong className="font-medium">Ros Connected:</strong> {rosConnected ? "Yes" : "No"}
            </div>
        </div>
    );
};
