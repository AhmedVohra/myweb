"use client";

interface PixelDividerProps {
    label?: string;
    color?: "primary" | "secondary" | "accent";
}

export default function PixelDivider({
    label = "///",
    color = "primary",
}: PixelDividerProps) {
    const colorVar =
        color === "secondary"
            ? "var(--secondary)"
            : color === "accent"
                ? "var(--accent)"
                : "var(--primary)";

    return (
        <div
            className="pixel-divider"
            style={{ color: colorVar }}
        >
            <span>{label}</span>
        </div>
    );
}
