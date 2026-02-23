"use client";

interface PixelDividerProps {
    label?: string;
}

export default function PixelDivider({ label = "///" }: PixelDividerProps) {
    return (
        <div className="pixel-divider">
            <span style={{ whiteSpace: "nowrap" }}>{"// "}{label.toLowerCase().replace(/ /g, "_")}</span>
        </div>
    );
}
