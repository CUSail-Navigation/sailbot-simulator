import { toRadians } from "../utils/coordinates";
export function OverlayLines({
    boatX, boatY, boatAngle, rudderAngle, sailAngle, absoluteWind
}: { boatX: number; boatY: number; boatAngle: number; rudderAngle: number; sailAngle: number; absoluteWind: number }) {

    const drawLine = (offsetAngle: number, color: string) => {
        const angle = toRadians(-boatAngle + offsetAngle);
        const x2 = boatX + -75 * Math.cos(angle);
        const y2 = boatY + -75 * Math.sin(angle);
        return <line x1={boatX} y1={boatY} x2={x2} y2={y2} stroke={color} strokeWidth="3" />;
    };

    const drawWindArrow = () => {
        const angle = toRadians(absoluteWind);
        const x2 = boatX + 100 * Math.cos(angle);
        const y2 = boatY + 100 * Math.sin(angle);
        return (
            <line
                x1={boatX}
                y1={boatY}
                x2={x2}
                y2={y2}
                stroke="teal"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
            />
        );
    };

    const drawOppositeTriangle = () => {
        const baseAngle = toRadians(absoluteWind + 180); // Opposite direction of the wind
        const leftAngle = baseAngle - toRadians(30); // 30 degrees to the left
        const rightAngle = baseAngle + toRadians(30); // 30 degrees to the right

        const x1 = boatX - 1 * Math.cos(baseAngle);
        const y1 = boatY - 1 * Math.sin(baseAngle);
        const x2 = boatX + 90 * Math.cos(leftAngle);
        const y2 = boatY + 90 * Math.sin(leftAngle);
        const x3 = boatX + 90 * Math.cos(rightAngle);
        const y3 = boatY + 90 * Math.sin(rightAngle);

        return (
            <polygon
                points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                fill="rgba(0, 128, 128, 0.5)" // Semi-transparent teal
                stroke="teal"
                strokeWidth="2"
            />
        );
    };

    return (
        <>
            {drawLine(rudderAngle, 'red')}
            {drawLine(sailAngle, 'gold')}
            {drawWindArrow()}
            {drawOppositeTriangle()}
        </>
    );
}

