import { encode } from "uqr";
import type { QrCodeProps } from "./types";
import styles from "./PhoneImportPanel.module.css";

/** A QR code drawn as one SVG path: sharp at any size, and the quiet zone (border) is part of it. */
export function QrCode({ value, label }: QrCodeProps) {
    const { data, size } = encode(value, { ecc: "M", border: 2 });
    return (
        <svg
            className={styles.qr}
            role="img"
            aria-label={label}
            viewBox={`0 0 ${size} ${size}`}
            shapeRendering="crispEdges"
        >
            <rect width={size} height={size} fill="#ffffff" />
            <path d={darkModulesPath(data)} fill="#20140b" />
        </svg>
    );
}

function darkModulesPath(modules: boolean[][]): string {
    return modules
        .flatMap((row, y) =>
            row.flatMap((isDark, x) => (isDark ? [`M${x} ${y}h1v1h-1z`] : [])),
        )
        .join("");
}
