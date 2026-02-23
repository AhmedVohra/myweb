"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Star } from "lucide-react";
import { Post, formatDate } from "@/lib/posts";

interface PostCardProps {
    post: Post;
    index?: number;
    featured?: boolean;
}

const CATEGORY_CLASSES: Record<string, string> = {
    "AL Development": "cat-al",
    Performance: "cat-perf",
    Integrations: "cat-int",
    DevOps: "cat-devops",
    "Best Practices": "cat-best",
};

export default function PostCard({ post, index, featured = false }: PostCardProps) {
    const catClass = CATEGORY_CLASSES[post.category] || "cat-default";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: (index ?? 0) * 0.05 }}
            style={{ height: "100%" }}
        >
            <Link href={`/post/${post.slug}`} style={{ display: "block", height: "100%", textDecoration: "none" }}>
                <article
                    className="card-code"
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        padding: "1.25rem",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "8px",
                            marginBottom: "0.75rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            {/* Index prefix (ctxdc style) */}
                            {index !== undefined && (
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.62rem",
                                        color: "var(--text-faint)",
                                    }}
                                >
                                    {"["}
                                    {String(index + 1).padStart(2, "0")}
                                    {"]"}
                                </span>
                            )}
                            <span
                                className={`tag-mono ${catClass}`}
                                style={{ border: "1px solid" }}
                            >
                                {post.category}
                            </span>
                        </div>
                        {post.featured && (
                            <Star
                                size={12}
                                fill="var(--amber)"
                                style={{ color: "var(--amber)", flexShrink: 0 }}
                            />
                        )}
                    </div>

                    {/* Title */}
                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: featured ? "1.05rem" : "0.9rem",
                            color: "var(--text)",
                            lineHeight: 1.35,
                            marginBottom: "0.6rem",
                            letterSpacing: "-0.01em",
                            transition: "color 0.15s",
                        }}
                    >
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                        style={{
                            flex: 1,
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.78rem",
                            color: "var(--text-muted)",
                            lineHeight: 1.6,
                            marginBottom: "1rem",
                        }}
                    >
                        {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "0.75rem" }}>
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.62rem",
                                    color: "var(--text-faint)",
                                }}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingTop: "0.75rem",
                            borderTop: "1px solid var(--border)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "var(--text-faint)",
                            }}
                        >
                            <span>{formatDate(post.date)}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Clock size={10} />
                                {post.readTime}m
                            </span>
                        </div>
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "var(--amber)",
                            }}
                        >
                            read() <ArrowRight size={10} />
                        </span>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
