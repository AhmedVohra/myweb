"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowRight, Star } from "lucide-react";
import { Post, formatDate } from "@/lib/posts";

interface PostCardProps {
    post: Post;
    featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
    const categoryColors: Record<string, string> = {
        "AL Development": "var(--primary)",
        Performance: "var(--secondary)",
        Integrations: "var(--accent)",
        DevOps: "var(--green)",
        "Best Practices": "var(--secondary)",
    };

    const catColor = categoryColors[post.category] || "var(--text-muted)";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
        >
            <Link href={`/post/${post.slug}`} className="block h-full group">
                <article
                    className="card-scan pixel-corner h-full flex flex-col p-5 transition-all duration-200"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        position: "relative",
                    }}
                >
                    {/* Hover border glow */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                            border: `1px solid ${catColor}`,
                            boxShadow: `0 0 15px ${catColor}22, inset 0 0 15px ${catColor}08`,
                        }}
                    />

                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <span
                            className="text-xs px-2 py-1 border"
                            style={{
                                fontFamily: "var(--font-pixel)",
                                fontSize: "6px",
                                color: catColor,
                                borderColor: catColor,
                                background: `${catColor}15`,
                                letterSpacing: "0.5px",
                            }}
                        >
                            {post.category}
                        </span>
                        {post.featured && (
                            <Star
                                size={12}
                                fill="var(--accent)"
                                style={{ color: "var(--accent)", flexShrink: 0 }}
                            />
                        )}
                    </div>

                    {/* Title */}
                    <h2
                        className="mb-2 group-hover:text-orange-400 transition-colors"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: featured ? "12px" : "9px",
                            color: "var(--text)",
                            lineHeight: 1.6,
                        }}
                    >
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                        className="flex-1 mb-4 text-sm"
                        style={{
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-mono)",
                            lineHeight: 1.6,
                            fontSize: "0.85rem",
                        }}
                    >
                        {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "11px",
                                    color: "var(--secondary)",
                                    opacity: 0.8,
                                }}
                            >
                                <Tag size={8} />
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Footer */}
                    <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <div
                            className="flex items-center gap-3"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                color: "var(--text-muted)",
                            }}
                        >
                            <span>{formatDate(post.date)}</span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {post.readTime}m
                            </span>
                        </div>
                        <span
                            className="flex items-center gap-1 group-hover:gap-2 transition-all"
                            style={{
                                fontFamily: "var(--font-pixel)",
                                fontSize: "7px",
                                color: "var(--primary)",
                            }}
                        >
                            READ
                            <ArrowRight size={10} />
                        </span>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
