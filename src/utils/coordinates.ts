export function toRadians(deg: number): number {
    return (deg * Math.PI) / 180;
}

export function latLonToXY(lat: number, lon: number, bounds: Bounds, width: number, height: number) {
    const x = ((lon - bounds.lonMin) / (bounds.lonMax - bounds.lonMin)) * width;
    const y = height - ((lat - bounds.latMin) / (bounds.latMax - bounds.latMin)) * height;
    return { x, y };
}

export function xyToLatLon(x: number, y: number, bounds: Bounds, width: number, height: number) {
    const lon = (x / width) * (bounds.lonMax - bounds.lonMin) + bounds.lonMin;
    const lat = bounds.latMax - (y / height) * (bounds.latMax - bounds.latMin);
    return { lat, lon };
}

export type Bounds = {
    latMin: number;
    latMax: number;
    lonMin: number;
    lonMax: number;
};

