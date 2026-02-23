"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command } from "lucide-react";

interface SearchBarProps {
    compact?: boolean;
}

export default function SearchBar({ compact = false }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Ctrl+K shortcut
    const handleKeydown = useCallback(
        (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") {
                setQuery("");
                inputRef.current?.blur();
            }
        },
        []
    );

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
                className="flex items-center gap-2 px-3 py-2 transition-all"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    width: compact ? "220px" : "100%",
                }}
            >
                <Search size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={compact ? "SEARCH..." : "Search posts, tags, categories..."}
                    className="bg-transparent outline-none flex-1 placeholder:opacity-50"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: compact ? "12px" : "14px",
                        color: "var(--text)",
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        style={{ color: "var(--text-muted)" }}
                    >
                        <X size={12} />
                    </button>
                )}
                {!query && compact && (
                    <div
                        className="hidden lg:flex items-center gap-0.5 px-1 border"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "6px",
                            color: "var(--text-muted)",
                            borderColor: "var(--border)",
                        }}
                    >
                        <Command size={7} />K
                    </div>
                )}
            </div>
        </form>
    );
}
