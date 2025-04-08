import { useRef, useState } from 'react';

import { OverlayLines } from './OverlayLines';
import { MapDefs } from './MapDefs';
import { Boat } from './Boat';

import { latLonToXY, xyToLatLon } from '../utils/coordinates';
import { useBoatStore } from '../state/useBoatStore';
import { useWaypointStore } from '../state/useWaypointStore';

import { setWaypointQueue, publishGPS } from '../ros/publishers';

export function BoatCanvas() {
    const { rudderAngle, sailAngle, pose, relativeWind } = useBoatStore();
    const { waypoints, setWaypoints } = useWaypointStore();

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef<{ x: number; y: number } | null>(null);
    const [hoverCoord, setHoverCoord] = useState<{ lat: number; lon: number } | null>(null);

    const [isDraggingBoat, setIsDraggingBoat] = useState(false);

    const svgRef = useRef<SVGSVGElement>(null);

    // initial bounds on the map
    const bounds = {
        latMin: 46.500000,
        latMax: 46.501000,
        lonMin: -76.501000,
        lonMax: -76.500000
    };

    const CANVAS_WIDTH = 1100;
    const CANVAS_HEIGHT = 800;

    const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
        const zoomFactor = 1.1;
        const direction = e.deltaY > 0 ? -1 : 1;
        setZoom((prevZoom) => {
            const nextZoom = direction > 0 ? prevZoom * zoomFactor : prevZoom / zoomFactor;
            return Math.min(Math.max(nextZoom, 0.1), 10); // clamp zoom 10x in or out
        });
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        const adjustedX = (svgP.x - offset.x) / zoom;
        const adjustedY = (svgP.y - offset.y) / zoom;

        const dx = adjustedX - boatX;
        const dy = adjustedY - boatY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const hitboxRadius = 40 / zoom;
        if (dist < hitboxRadius) {
            setIsDraggingBoat(true);
        } else {
            setIsPanning(true);
            panStart.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        const adjustedX = (svgP.x - offset.x) / zoom;
        const adjustedY = (svgP.y - offset.y) / zoom;

        handleHoverMove(e); // updates tooltip

        if (isDraggingBoat) {
            const { lat, lon } = xyToLatLon(adjustedX, adjustedY, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
            useBoatStore.getState().setPosition(lat, lon);
            publishGPS(lat, lon); // publish the new GPS position
        } else {
            if (!isPanning || !panStart.current) return;

            const dx = (e.clientX - panStart.current.x) / zoom;
            const dy = (e.clientY - panStart.current.y) / zoom;

            setOffset((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));

            panStart.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleHoverMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;

        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        // Adjust for pan and zoom
        const adjustedX = (svgP.x - offset.x) / zoom;
        const adjustedY = (svgP.y - offset.y) / zoom;

        const { lat, lon } = xyToLatLon(adjustedX, adjustedY, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
        setHoverCoord({ lat, lon });
    };

    const handleMouseLeave = () => {
        setHoverCoord(null);
        handleMouseUp(); // stop panning too
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        panStart.current = null;
        setIsDraggingBoat(false);
    };

    const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;

        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        const adjustedX = (svgP.x - offset.x) / zoom;
        const adjustedY = (svgP.y - offset.y) / zoom;

        const { lat, lon } = xyToLatLon(adjustedX, adjustedY, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Add the new waypoint
        setWaypoints([...(waypoints || []), { latitude: lat, longitude: lon }]);
        setWaypointQueue([...(waypoints || []), { latitude: lat, longitude: lon }]); // Update the waypoint queue
    };

    const { x: boatX, y: boatY } = latLonToXY(pose.latitude, pose.longitude, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
    const boatAngle = pose.theta;

    return (
        <div>
            {/* Canvas */}
            <svg
                ref={svgRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-400 rounded bg-white"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onDoubleClick={handleDoubleClick} // Handle double-click
            >
                <MapDefs />
                <g transform={`scale(${zoom}) translate(${offset.x}, ${offset.y})`}>
                    <rect
                        x="-10000"
                        y="-10000"
                        width={CANVAS_WIDTH * 1000}
                        height={CANVAS_HEIGHT * 1000}
                        fill="url(#bgPattern)"
                    />
                    <Boat x={boatX} y={boatY} angle={boatAngle} />
                    <OverlayLines
                        boatX={boatX}
                        boatY={boatY}
                        boatAngle={boatAngle}
                        rudderAngle={rudderAngle}
                        sailAngle={sailAngle}
                        windAngle={relativeWind}
                    />
                    {/* Render waypoints */}
                    {waypoints.map((wp, index) => {
                        const { x, y } = latLonToXY(wp.latitude, wp.longitude, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
                        return (
                            <g key={index}>
                                <circle cx={x} cy={y} r={5} fill="red" />
                                <text x={x + 10} y={y} fontSize="12" fill="black">
                                    {index + 1}
                                </text>
                            </g>
                        );
                    })}
                </g>
                {/* Tooltip for lat/lon coordinates */}
                {hoverCoord && (
                    <foreignObject x={10} y={10} width={195} height={40}>
                        <div className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded">
                            Lat: {hoverCoord.lat.toFixed(6)} | Lon: {hoverCoord.lon.toFixed(6)}
                        </div>
                    </foreignObject>
                )}
            </svg>
        </div>
    );
}
