"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
    { label: "home", href: "/" },
    { label: "al-development", href: "/category/AL Development" },
    { label: "search", href: "/search" },
    { label: "admin", href: "/admin" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav
            className="sticky top-0 z-50"
            style={{
                background: "rgba(13,13,13,0.96)",
                borderBottom: "1px solid var(--border)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "56px",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
                >
                    <div
                        style={{
                            width: "28px",
                            height: "28px",
                            background: "var(--amber)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: "11px",
                                color: "var(--bg)",
                                lineHeight: 1,
                            }}
                        >
                            BC
                        </span>
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                color: "var(--text)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.1,
                            }}
                        >
                            BC.KNOWLEDGE
                        </div>
                        <div
                            className="hidden sm:block"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.6rem",
                                color: "var(--text-muted)",
                            }}
                        >
                            {"// AL developer's knowledgebase"}
                        </div>
                    </div>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center" style={{ gap: "2px" }}>
                    {NAV_LINKS.map((link) => {
                        const active =
                            pathname === link.href ||
                            (link.href !== "/" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: active ? "var(--amber)" : "var(--text-muted)",
                                    padding: "6px 14px",
                                    borderRadius: "4px",
                                    textDecoration: "none",
                                    background: active ? "var(--amber-bg)" : "transparent",
                                    transition: "color 0.15s, background 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        (e.currentTarget as HTMLElement).style.color = "var(--text)";
                                        (e.currentTarget as HTMLElement).style.background = "var(--surface2)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                                        (e.currentTarget as HTMLElement).style.background = "transparent";
                                    }
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Search + mobile toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="hidden lg:block">
                        <SearchBar compact />
                    </div>
                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            color: "var(--text-muted)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            padding: "4px",
                        }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    className="md:hidden"
                    style={{
                        borderTop: "1px solid var(--border)",
                        background: "var(--surface)",
                    }}
                >
                    <div style={{ padding: "12px 16px" }}>
                        <SearchBar compact />
                    </div>
                    {NAV_LINKS.map((link) => {
                        const active =
                            pathname === link.href ||
                            (link.href !== "/" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "12px 16px",
                                    borderTop: "1px solid var(--border)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.8rem",
                                    color: active ? "var(--amber)" : "var(--text-muted)",
                                    textDecoration: "none",
                                }}
                            >
                                <span style={{ color: "var(--amber)", opacity: 0.5 }}>{">"}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
