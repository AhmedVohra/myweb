"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, ArrowLeft, ArrowRight, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
    Post,
    fetchPosts,
    sortByDate,
    getPostBySlug,
    formatDate,
} from "@/lib/posts";
import PixelDivider from "@/components/PixelDivider";

export default function PostPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [post, setPost] = useState<Post | null>(null);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts().then((data) => {
            const sorted = sortByDate(data);
            setAllPosts(sorted);
            const found = getPostBySlug(sorted, slug);
            if (found) {
                setPost(found);
            } else {
                router.push("/");
            }
            setLoading(false);
        });
    }, [slug, router]);

    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--amber)",
                }}
            >
                {"// loading post..."}
            </div>
        );
    }

    if (!post) return null;

    const currentIndex = allPosts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    return (
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--text-faint)",
                    marginBottom: "2rem",
                }}
            >
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        transition: "color 0.15s",
                    }}
                >
                    <ChevronLeft size={12} />
                    home
                </Link>
                <span>/</span>
                <Link
                    href={`/category/${encodeURIComponent(post.category)}`}
                    style={{ color: "var(--amber)", textDecoration: "none" }}
                >
                    {post.category}
                </Link>
                <span>/</span>
                <span style={{ color: "var(--text-faint)" }}>post</span>
            </motion.div>

            {/* Post Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    marginBottom: "2rem",
                    padding: "2rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border-mid)",
                    borderRadius: "4px",
                    borderLeft: "3px solid var(--amber)",
                }}
            >
                {/* Category + badges */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                    <Link
                        href={`/category/${encodeURIComponent(post.category)}`}
                        className="tag-mono cat-al"
                        style={{ border: "1px solid", textDecoration: "none" }}
                    >
                        {post.category}
                    </Link>
                    {post.featured && (
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                color: "var(--amber)",
                                background: "var(--amber-bg)",
                                border: "1px solid rgba(240,192,64,0.2)",
                                borderRadius: "3px",
                                padding: "2px 8px",
                            }}
                        >
                            ★ featured
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                        color: "var(--text)",
                        letterSpacing: "-0.025em",
                        lineHeight: 1.2,
                        marginBottom: "1.25rem",
                    }}
                >
                    {post.title}
                </h1>

                {/* Meta row */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-faint)",
                        marginBottom: "1rem",
                    }}
                >
                    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Calendar size={11} />
                        {formatDate(post.date)}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={11} />
                        {post.readTime} min read
                    </span>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {post.tags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/search?q=${encodeURIComponent(tag)}`}
                            className="tag-mono"
                            style={{ textDecoration: "none" }}
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Post Body */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{
                    marginBottom: "2rem",
                    padding: "2rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                }}
            >
                <div className="prose-retro">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
                </div>
            </motion.div>

            {/* Prev/Next navigation */}
            <PixelDivider label="MORE POSTS" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", border: "1px solid var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                {prevPost && (
                    <Link href={`/post/${prevPost.slug}`} style={{ textDecoration: "none" }}>
                        <div
                            className="card-code"
                            style={{ padding: "1.25rem", height: "100%", borderRadius: 0, border: "none" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--text-faint)",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <ArrowLeft size={10} />
                                older post
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    color: "var(--text-dim)",
                                    lineHeight: 1.4,
                                }}
                            >
                                {prevPost.title}
                            </div>
                        </div>
                    </Link>
                )}
                {nextPost && (
                    <Link href={`/post/${nextPost.slug}`} style={{ textDecoration: "none" }}>
                        <div
                            className="card-code"
                            style={{ padding: "1.25rem", height: "100%", borderRadius: 0, border: "none", textAlign: "right" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    gap: "6px",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--text-faint)",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                newer post
                                <ArrowRight size={10} />
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    color: "var(--text-dim)",
                                    lineHeight: 1.4,
                                }}
                            >
                                {nextPost.title}
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
