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

    if (posts.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center py-16 gap-4"
                style={{ color: "var(--text-muted)" }}
            >
                <div
                    style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "10px",
                        color: "var(--primary)",
                    }}
                >
                    NO POSTS FOUND
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px" }}>
                    &gt; No records match your query_
                </div>
            </div>
        );
    }

    return (
        <div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                    {paginated.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-2 px-4 py-2 transition-all disabled:opacity-30"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--primary)",
                            border: "1px solid var(--border-bright)",
                            background: "var(--surface)",
                        }}
                    >
                        <ChevronLeft size={12} />
                        PREV
                    </button>

                    <div
                        className="flex items-center gap-2"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--text-muted)",
                        }}
                    >
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className="w-6 h-6 transition-all"
                                style={{
                                    background:
                                        i === page ? "var(--primary)" : "var(--surface)",
                                    color: i === page ? "var(--bg)" : "var(--text-muted)",
                                    border: `1px solid ${i === page ? "var(--primary)" : "var(--border)"
                                        }`,
                                    fontSize: "8px",
                                    fontFamily: "var(--font-pixel)",
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="flex items-center gap-2 px-4 py-2 transition-all disabled:opacity-30"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--primary)",
                            border: "1px solid var(--border-bright)",
                            background: "var(--surface)",
                        }}
                    >
                        NEXT
                        <ChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}
