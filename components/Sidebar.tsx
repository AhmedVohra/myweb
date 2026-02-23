"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Hash, Folder } from "lucide-react";
import { Post, getCategories, getAllTags, sortByDate, formatDate } from "@/lib/posts";

interface SidebarProps {
    posts: Post[];
    activeCategory?: string;
}

export default function Sidebar({ posts, activeCategory }: SidebarProps) {
    const router = useRouter();
    const categories = getCategories(posts);
    const tags = getAllTags(posts).slice(0, 15);
    const recent = sortByDate(posts).slice(0, 5);

    return (
        <aside className="space-y-6">
            {/* Categories */}
            <div
                className="pixel-border p-4"
                style={{ background: "var(--surface)" }}
            >
                <div
                    className="flex items-center gap-2 mb-4 pb-2 border-b"
                    style={{ borderColor: "var(--border)" }}
                >
                    <Folder size={12} style={{ color: "var(--primary)" }} />
                    <span
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--primary)",
                        }}
                    >
                        CATEGORIES
                    </span>
                </div>
                <div className="space-y-1">
                    <button
                        onClick={() => router.push("/")}
                        className="w-full flex items-center justify-between px-2 py-1.5 transition-all"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            color: !activeCategory ? "var(--primary)" : "var(--text-muted)",
                            background: !activeCategory
                                ? "rgba(249,115,22,0.1)"
                                : "transparent",
                            border: !activeCategory
                                ? "1px solid var(--primary)"
                                : "1px solid transparent",
                            textAlign: "left",
                        }}
                    >
                        <span>ALL POSTS</span>
                        <span
                            className="text-xs px-1.5 py-0.5"
                            style={{
                                background: "var(--surface2)",
                                color: "var(--text-muted)",
                                fontFamily: "var(--font-pixel)",
                                fontSize: "7px",
                            }}
                        >
                            {posts.length}
                        </span>
                    </button>
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.name;
                        return (
                            <Link
                                key={cat.name}
                                href={`/category/${encodeURIComponent(cat.name)}`}
                                className="flex items-center justify-between px-2 py-1.5 transition-all"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "13px",
                                    color: isActive ? "var(--secondary)" : "var(--text-muted)",
                                    background: isActive
                                        ? "rgba(34,211,238,0.08)"
                                        : "transparent",
                                    border: isActive
                                        ? "1px solid var(--secondary)"
                                        : "1px solid transparent",
                                }}
                            >
                                <span>&gt; {cat.name}</span>
                                <span
                                    className="text-xs px-1.5 py-0.5"
                                    style={{
                                        background: "var(--surface2)",
                                        color: "var(--text-muted)",
                                        fontFamily: "var(--font-pixel)",
                                        fontSize: "7px",
                                    }}
                                >
                                    {cat.count}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Posts */}
            <div
                className="pixel-border p-4"
                style={{ background: "var(--surface)" }}
            >
                <div
                    className="flex items-center gap-2 mb-4 pb-2 border-b"
                    style={{ borderColor: "var(--border)" }}
                >
                    <Clock size={12} style={{ color: "var(--accent)" }} />
                    <span
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--accent)",
                        }}
                    >
                        RECENT POSTS
                    </span>
                </div>
                <div className="space-y-3">
                    {recent.map((post) => (
                        <Link
                            key={post.id}
                            href={`/post/${post.slug}`}
                            className="block group"
                        >
                            <div
                                className="text-sm group-hover:text-orange-400 transition-colors leading-snug"
                                style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
                            >
                                {post.title}
                            </div>
                            <div
                                className="text-xs mt-0.5"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {formatDate(post.date)}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tag Cloud */}
            <div
                className="pixel-border p-4"
                style={{ background: "var(--surface)" }}
            >
                <div
                    className="flex items-center gap-2 mb-4 pb-2 border-b"
                    style={{ borderColor: "var(--border)" }}
                >
                    <Hash size={12} style={{ color: "var(--secondary)" }} />
                    <span
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--secondary)",
                        }}
                    >
                        TAG CLOUD
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(({ tag }) => (
                        <Link
                            key={tag}
                            href={`/search?q=${encodeURIComponent(tag)}`}
                            className="px-2 py-1 text-xs transition-all hover:border-cyan-400"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                color: "var(--secondary)",
                                border: "1px solid var(--border)",
                                background: "var(--surface2)",
                            }}
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </div>

            {/* System Info */}
            <div
                className="p-3"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    color: "var(--text-muted)",
                    lineHeight: 2,
                }}
            >
                <div style={{ color: "var(--green)" }}>■ SYSTEM STATUS</div>
                <div>POSTS: {posts.length}</div>
                <div>CATEGORIES: {categories.length}</div>
                <div>TAGS: {tags.length}</div>
                <div style={{ color: "var(--accent)" }}>AL DEV TERMINAL v2.6.0</div>
            </div>
        </aside>
    );
}
