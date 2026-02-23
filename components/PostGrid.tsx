"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PostCard from "./PostCard";
import { Post } from "@/lib/posts";

interface PostGridProps {
    posts: Post[];
    pageSize?: number;
}

export default function PostGrid({ posts, pageSize = 6 }: PostGridProps) {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(posts.length / pageSize);
    const paginated = posts.slice(page * pageSize, (page + 1) * pageSize);
    const pageOffset = page * pageSize;

    if (posts.length === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5rem 0",
                    gap: "0.5rem",
                }}
            >
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--amber)",
                    }}
                >
                    {"// no_results_found"}
                </div>
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                    }}
                >
                    No posts match your query.
                </div>
            </div>
        );
    }

    return (
        <div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={page}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1px",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        overflow: "hidden",
                    }}
                >
                    {paginated.map((post, i) => (
                        <PostCard key={post.id} post={post} index={pageOffset + i} />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginTop: "2rem",
                    }}
                >
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 14px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: page === 0 ? "var(--text-faint)" : "var(--text-dim)",
                            border: "1px solid var(--border-mid)",
                            borderRadius: "4px",
                            background: "var(--surface)",
                            cursor: page === 0 ? "not-allowed" : "pointer",
                            transition: "color 0.15s, border-color 0.15s",
                        }}
                    >
                        <ChevronLeft size={12} />
                        prev
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    background: i === page ? "var(--amber)" : "var(--surface)",
                                    color: i === page ? "var(--bg)" : "var(--text-muted)",
                                    border: `1px solid ${i === page ? "var(--amber)" : "var(--border-mid)"}`,
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: i === page ? 600 : 400,
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 14px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: page === totalPages - 1 ? "var(--text-faint)" : "var(--text-dim)",
                            border: "1px solid var(--border-mid)",
                            borderRadius: "4px",
                            background: "var(--surface)",
                            cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                            transition: "color 0.15s, border-color 0.15s",
                        }}
                    >
                        next
                        <ChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}
