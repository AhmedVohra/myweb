"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Terminal, Cpu } from "lucide-react";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
    { label: "HOME", href: "/" },
    { label: "CATEGORY", href: "/category/AL Development" },
    { label: "SEARCH", href: "/search" },
    { label: "ADMIN", href: "/admin" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav
            className="sticky top-0 z-50 border-b"
            style={{
                background: "rgba(10,14,26,0.95)",
                borderColor: "var(--border-bright)",
                backdropFilter: "blur(8px)",
            }}
        >
            {/* Top status bar */}
            <div
                className="hidden md:flex items-center justify-between px-6 py-1 text-xs border-b"
                style={{
                    borderColor: "var(--border)",
                    background: "rgba(0,0,0,0.3)",
                    fontFamily: "var(--font-pixel)",
                    color: "var(--text-muted)",
                    fontSize: "7px",
                }}
            >
                <span style={{ color: "var(--green)" }}>■ SYSTEM ONLINE</span>
                <span>KNOWLEDGE.DB v2.6.0 // AL DEVELOPER TERMINAL</span>
                <span style={{ color: "var(--accent)" }}>
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            </div>

            {/* Main nav */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div
                        className="flex items-center justify-center w-9 h-9 border-2"
                        style={{
                            borderColor: "var(--primary)",
                            boxShadow: "0 0 12px var(--primary-glow)",
                            background: "var(--surface)",
                        }}
                    >
                        <Cpu size={18} style={{ color: "var(--primary)" }} />
                    </div>
                    <div className="hidden sm:block">
                        <div
                            className="glow-primary cursor-blink"
                            style={{
                                fontFamily: "var(--font-pixel)",
                                fontSize: "10px",
                                color: "var(--primary)",
                                letterSpacing: "1px",
                            }}
                        >
                            BC.KNOWLEDGE
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-terminal)",
                                fontSize: "14px",
                                color: "var(--text-muted)",
                                lineHeight: 1,
                            }}
                        >
                            &gt; AL Developer&apos;s Knowledgebase
                        </div>
                    </div>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const active = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 transition-all duration-150 group"
                                style={{
                                    fontFamily: "var(--font-pixel)",
                                    fontSize: "8px",
                                    color: active ? "var(--primary)" : "var(--text-muted)",
                                    background: active
                                        ? "rgba(249,115,22,0.1)"
                                        : "transparent",
                                    border: active
                                        ? "1px solid var(--primary)"
                                        : "1px solid transparent",
                                }}
                            >
                                {link.label}
                                {!active && (
                                    <span
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{
                                            border: "1px solid var(--border-bright)",
                                        }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Search + mobile toggle */}
                <div className="flex items-center gap-3">
                    <div className="hidden lg:block">
                        <SearchBar compact />
                    </div>
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ color: "var(--text-muted)" }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    className="md:hidden border-t"
                    style={{
                        borderColor: "var(--border)",
                        background: "var(--surface)",
                    }}
                >
                    <div className="px-4 py-2">
                        <SearchBar compact />
                    </div>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 border-b"
                            style={{
                                fontFamily: "var(--font-pixel)",
                                fontSize: "8px",
                                color: "var(--text-muted)",
                                borderColor: "var(--border)",
                            }}
                        >
                            <Terminal size={10} style={{ color: "var(--primary)" }} />
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
