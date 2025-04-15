export function Boat({ x, y, angle }: { x: number; y: number; angle: number }) {
    return (
        <g transform={`translate(${x}, ${y}) rotate(${-angle})`}>
            {/* Triangle pointing right by default, then rotated via parent group */}
            <polygon
                points="50,0 -15,-15 -15,15"
                fill="navy"
                stroke="black"
                strokeWidth="1"
            />
        </g>
    );
}
