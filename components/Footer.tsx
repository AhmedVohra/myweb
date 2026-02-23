"use client";

export default function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--border)",
                background: "var(--surface)",
                marginTop: "5rem",
            }}
        >
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "3rem 1.5rem",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "end",
                    gap: "2rem",
                }}
            >
                {/* Left: Brand */}
                <div>
                    <div
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "1.25rem",
                            color: "var(--text)",
                            letterSpacing: "-0.02em",
                            marginBottom: "0.4rem",
                        }}
                    >
                        BC.KNOWLEDGE
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        {"// AL developer's knowledgebase"}
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--text-faint)",
                            marginTop: "1.5rem",
                        }}
                    >
                        © {new Date().getFullYear()} — built with Next.js + Cloudflare Pages
                    </div>
                </div>

                {/* Right: Links */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                    }}
                >
                    {[
                        { label: "home.tsx", href: "/" },
                        { label: "search.tsx", href: "/search" },
                        { label: "admin.tsx", href: "/admin" },
                    ].map((link) => (
                        <a key={link.href} href={link.href} className="footer-link">
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
