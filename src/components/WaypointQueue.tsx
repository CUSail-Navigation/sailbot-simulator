import React from 'react';
import { useWaypointStore } from '../state/useWaypointStore';
import { setWaypointQueue } from '../ros/publishers';

export function WaypointQueue() {
    const { waypoints, setWaypoints } = useWaypointStore();

    const handleDelete = (index: number) => {
        const updatedWaypoints = waypoints.filter((_, i) => i !== index);
        setWaypoints(updatedWaypoints);
        setWaypointQueue(updatedWaypoints);
    };

    return (
        <div className="p-4 space-y-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📍</span> Waypoints
            </h2>

            <div className=" rounded-md shadow-sm max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <ul className="space-y-2">
                    {waypoints.map((wp, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between bg-white border border-gray-300 p-3 rounded-md shadow-sm"
                        >
                            <span className="text-gray-700">
                                {index + 1}: {wp.latitude.toFixed(6)}, {wp.longitude.toFixed(6)}
                            </span>
                            <button
                                onClick={() => handleDelete(index)}
                                className="text-red-500 hover:text-red-700 text-sm p-1 rounded-md"
                                aria-label="Delete waypoint"
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}