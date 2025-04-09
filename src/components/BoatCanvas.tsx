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

  const bounds = {
    latMin: 46.500000,
    latMax: 46.501000,
    lonMin: -76.501000,
    lonMax: -76.500000
  };

  const CANVAS_WIDTH = 1100;
  const CANVAS_HEIGHT = 800;

  const getRelativeSVGCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || !svg.getScreenCTM()) return { x: 0, y: 0 };
  
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
  
    const transformed = point.matrixTransform(svg.getScreenCTM()!.inverse());
    const adjustedX = (transformed.x - offset.x) / zoom;
    const adjustedY = (transformed.y - offset.y) / zoom;
  
    return { x: adjustedX, y: adjustedY };
  };
  

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    const zoomFactor = 1.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    setZoom((prevZoom) => {
      const nextZoom = direction > 0 ? prevZoom * zoomFactor : prevZoom / zoomFactor;
      return Math.min(Math.max(nextZoom, 0.1), 10);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = getRelativeSVGCoords(e);

    const dx = x - boatX;
    const dy = y - boatY;
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
    const { x, y } = getRelativeSVGCoords(e);

    handleHoverMove(x, y);

    if (isDraggingBoat) {
      const { lat, lon } = xyToLatLon(x, y, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
      useBoatStore.getState().setPosition(lat, lon);
      publishGPS(lat, lon);
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

  const handleHoverMove = (x: number, y: number) => {
    const { lat, lon } = xyToLatLon(x, y, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHoverCoord({ lat, lon });
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
    handleMouseUp();
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    panStart.current = null;
    setIsDraggingBoat(false);
  };

  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = getRelativeSVGCoords(e);
    const { lat, lon } = xyToLatLon(x, y, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);

    const newWaypoint = { latitude: lat, longitude: lon };
    const updated = [...(waypoints || []), newWaypoint];
    setWaypoints(updated);
    setWaypointQueue(updated);
  };

  const { x: boatX, y: boatY } = latLonToXY(pose.latitude, pose.longitude, bounds, CANVAS_WIDTH, CANVAS_HEIGHT);
  const boatAngle = pose.theta;

  return (
    <div>
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
        onDoubleClick={handleDoubleClick}
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
