"use client";

import { useEffect } from "react";

export default function CRTOverlay() {
    useEffect(() => {
        // Ensure overlay is present
    }, []);

    return (
        <>
            <div className="crt-overlay" aria-hidden="true" />
        </>
    );
}
