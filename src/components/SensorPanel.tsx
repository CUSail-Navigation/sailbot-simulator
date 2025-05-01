import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { publishGPS, publishIMU, publishWind } from '../ros/publishers';
import { useBoatStore } from '../state/useBoatStore';
import { useEnvironmentStore } from '../state/useEnvironmentStore';

export function SensorPanel() {
    const [latitude, setLatitude] = useState(46.5005);
    const [longitude, setLongitude] = useState(-76.5005);
    const [heading, setHeading] = useState(0);
    const [wind, setWind] = useState(5);

    const debouncedHeadingChange = useCallback(
        debounce((newHeading) => {
            useBoatStore.getState().setHeading(newHeading);
            publishIMU(0, 0, newHeading);

            // calculate relative wind, then publish it
            const relativeWind = (wind - newHeading + 360) % 360;
            useBoatStore.getState().setRelativeWind(relativeWind);
            publishWind(relativeWind);
        }, 100),
        [wind]
    );

    const debouncedWindChange = useCallback(
        debounce((newWind) => {
            // set absolute wind first
            useEnvironmentStore.getState().setAbsoluteWind(-newWind);

            // calculate relative wind, then publish it
            const relativeWind = (newWind - heading + 360) % 360;
            useBoatStore.getState().setRelativeWind(relativeWind);
            publishWind(relativeWind);
        }, 100),
        [heading]
    );


    const handleHeadingChange = (value: number) => {
        setHeading(value);
        debouncedHeadingChange(value);
    };

    const handleWindChange = (value: number) => {
        setWind(value);
        debouncedWindChange(value);
    };

    const handleGPSChange = () => {
        useBoatStore.getState().setPosition(latitude, longitude);
        publishGPS(latitude, longitude);
        publishIMU(0, 0, heading);
        publishWind((wind - heading + 360) % 360);
    };

    return (
        <div className="p-4 space-y-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-gray-800">🛰 Sensor Sim</h2>

            {/* GPS Controls */}
            <div className="space-y-3 border p-4 rounded-md shadow-sm bg-gray-50">
                <div>
                    <label className="block font-medium text-gray-700">Latitude</label>
                    <input
                        type="number"
                        step="0.0001"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Longitude</label>
                    <input
                        type="number"
                        step="0.0001"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    />
                </div>

                <button
                    onClick={handleGPSChange}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    📡 Send GPS
                </button>
            </div>

            {/* IMU */}
            <div>
                <label className="block font-medium text-gray-700">Heading (deg)</label>
                <input
                    type="range"
                    min={0}
                    max={360}
                    value={heading}
                    className="w-full"
                    onChange={(e) => handleHeadingChange(parseInt(e.target.value))}
                    onDragStart={(e) => e.preventDefault()}
                />
                <span className="text-sm text-gray-700">{heading}°</span>
            </div>

            {/* Wind */}
            <div>
                <label className="block font-medium text-gray-700">Absolute Wind Direction</label>
                <input
                    type="range"
                    min={0}
                    max={360}
                    value={wind}
                    className="w-full"
                    onChange={(e) => handleWindChange(parseInt(e.target.value))}
                    onDragStart={(e) => e.preventDefault()}
                />
                <span className="text-sm text-gray-700">{wind}°</span>
            </div>
        </div>
    );
}
