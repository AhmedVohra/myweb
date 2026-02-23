"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command } from "lucide-react";

interface SearchBarProps {
    compact?: boolean;
}

export default function SearchBar({ compact = false }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeydown = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            inputRef.current?.focus();
        }
        if (e.key === "Escape") {
            setQuery("");
            inputRef.current?.blur();
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [handleKeydown]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    background: "var(--surface2)",
                    border: `1px solid ${focused ? "var(--amber)" : "var(--border-mid)"}`,
                    borderRadius: "4px",
                    width: compact ? "210px" : "100%",
                    transition: "border-color 0.15s",
                }}
            >
                <Search size={13} style={{ color: focused ? "var(--amber)" : "var(--text-muted)", flexShrink: 0, transition: "color 0.15s" }} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={compact ? "// search..." : "// search posts, tags, categories..."}
                    className="bg-transparent outline-none flex-1"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: compact ? "0.72rem" : "0.85rem",
                        color: "var(--text)",
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
                    >
                        <X size={12} />
                    </button>
                )}
                {!query && compact && (
                    <div
                        className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.6rem",
                            color: "var(--text-faint)",
                            border: "1px solid var(--border)",
                            borderRadius: "3px",
                        }}
                    >
                        <Command size={8} />K
                    </div>
                )}
            </div>
        </form>
    );
}
