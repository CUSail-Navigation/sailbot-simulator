import { toRadians } from "../utils/coordinates";
export function OverlayLines({
    boatX, boatY, boatAngle, rudderAngle, sailAngle, windAngle
}: { boatX: number; boatY: number; boatAngle: number; rudderAngle: number; sailAngle: number; windAngle: number }) {

    const drawLine = (offsetAngle: number, color: string) => {
        const angle = toRadians(boatAngle + offsetAngle);
        const x2 = boatX + 75 * Math.cos(angle);
        const y2 = boatY + 75 * Math.sin(angle);
        return <line x1={boatX} y1={boatY} x2={x2} y2={y2} stroke={color} strokeWidth="3" />;
    };

    const drawWindArrow = () => {
        const angle = toRadians(boatAngle + windAngle);
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

    return (
        <>
            {drawLine(rudderAngle, 'red')}
            {drawLine(sailAngle, 'gold')}
            {drawWindArrow()}
        </>
    );
}

