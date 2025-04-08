export function MapDefs() {
    return (
        <defs>
            <pattern
                id="bgPattern"
                x="0"
                y="0"
                width={256}
                height={256}
                patternUnits="userSpaceOnUse"
            >
                <image href="/water_large.png" width={256} height={256} />
            </pattern>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="teal" />
            </marker>
        </defs>
    );
}
