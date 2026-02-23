"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Folder, Hash } from "lucide-react";
import { Post, getCategories, getAllTags, sortByDate, formatDate } from "@/lib/posts";

interface SidebarProps {
    posts: Post[];
    activeCategory?: string;
}

function SidebarSection({
    label,
    icon,
    children,
}: {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                overflow: "hidden",
            }}
        >
            {/* Section header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface2)",
                }}
            >
                {icon}
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        color: "var(--amber)",
                    }}
                >
                    {"/* "}{label}{" */"}
                </span>
            </div>
            <div style={{ padding: "10px" }}>{children}</div>
        </div>
    );
}

export default function Sidebar({ posts, activeCategory }: SidebarProps) {
    const router = useRouter();
    const categories = getCategories(posts);
    const tags = getAllTags(posts).slice(0, 18);
    const recent = sortByDate(posts).slice(0, 5);

    return (
        <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Categories */}
            <SidebarSection
                label="categories"
                icon={<Folder size={12} style={{ color: "var(--amber)" }} />}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <button
                        onClick={() => router.push("/")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 8px",
                            borderRadius: "3px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: !activeCategory ? "var(--amber)" : "var(--text-dim)",
                            background: !activeCategory ? "var(--amber-bg)" : "transparent",
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left",
                            transition: "background 0.15s, color 0.15s",
                        }}
                    >
                        <span>{!activeCategory ? "> " : "  "}all posts</span>
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.62rem",
                                color: "var(--text-faint)",
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
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "6px 8px",
                                    borderRadius: "3px",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    color: isActive ? "var(--amber)" : "var(--text-dim)",
                                    background: isActive ? "var(--amber-bg)" : "transparent",
                                    textDecoration: "none",
                                    transition: "background 0.15s, color 0.15s",
                                }}
                            >
                                <span>{isActive ? "> " : "  "}{cat.name}</span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.62rem",
                                        color: "var(--text-faint)",
                                    }}
                                >
                                    {cat.count}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </SidebarSection>

            {/* Recent Posts */}
            <SidebarSection
                label="recent_posts"
                icon={<Clock size={12} style={{ color: "var(--green)" }} />}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {recent.map((post) => (
                        <Link
                            key={post.id}
                            href={`/post/${post.slug}`}
                            style={{ display: "block", textDecoration: "none" }}
                        >
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    color: "var(--text-dim)",
                                    lineHeight: 1.4,
                                    marginBottom: "2px",
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = "var(--text)")
                                }
                                onMouseLeave={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color = "var(--text-dim)")
                                }
                            >
                                {post.title}
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.62rem",
                                    color: "var(--text-faint)",
                                }}
                            >
                                {formatDate(post.date)}
                            </div>
                        </Link>
                    ))}
                </div>
            </SidebarSection>

            {/* Tag Cloud */}
            <SidebarSection
                label="tags"
                icon={<Hash size={12} style={{ color: "var(--blue)" }} />}
            >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {tags.map(({ tag }) => (
                        <Link
                            key={tag}
                            href={`/search?q=${encodeURIComponent(tag)}`}
                            className="tag-mono"
                            style={{ textDecoration: "none", display: "inline-block" }}
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </SidebarSection>
        </aside>
    );
}
