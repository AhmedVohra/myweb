"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, Tag, ArrowLeft, ArrowRight, Calendar, ChevronLeft } from "lucide-react";
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
                    fontFamily: "var(--font-pixel)",
                    fontSize: "10px",
                    color: "var(--primary)",
                }}
            >
                LOADING POST...
            </div>
        );
    }

    if (!post) return null;

    const currentIndex = allPosts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mb-6"
                style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    color: "var(--text-muted)",
                }}
            >
                <Link
                    href="/"
                    className="flex items-center gap-1 hover:text-orange-400 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                >
                    <ChevronLeft size={10} />
                    HOME
                </Link>
                <span>/</span>
                <Link
                    href={`/category/${encodeURIComponent(post.category)}`}
                    className="hover:text-cyan-400 transition-colors"
                    style={{ color: "var(--secondary)" }}
                >
                    {post.category.toUpperCase()}
                </Link>
                <span>/</span>
                <span style={{ color: "var(--primary)" }}>POST</span>
            </motion.div>

            {/* Post Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 p-6 md:p-8"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-bright)",
                    boxShadow: "0 0 30px rgba(249,115,22,0.08)",
                }}
            >
                {/* Category + badges */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Link
                        href={`/category/${encodeURIComponent(post.category)}`}
                        className="px-2 py-1 transition-all hover:opacity-80"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "6px",
                            color: "var(--primary)",
                            border: "1px solid var(--primary)",
                            background: "rgba(249,115,22,0.1)",
                        }}
                    >
                        {post.category}
                    </Link>
                    {post.featured && (
                        <span
                            className="px-2 py-1"
                            style={{
                                fontFamily: "var(--font-pixel)",
                                fontSize: "6px",
                                color: "var(--accent)",
                                border: "1px solid var(--accent)",
                                background: "rgba(250,204,21,0.08)",
                            }}
                        >
                            ★ FEATURED
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1
                    className="glow-primary mb-6"
                    style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "clamp(12px, 2.5vw, 20px)",
                        color: "var(--primary)",
                        lineHeight: 1.6,
                    }}
                >
                    {post.title}
                </h1>

                {/* Meta row */}
                <div
                    className="flex flex-wrap items-center gap-4 mb-4"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                    }}
                >
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime} min read
                    </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/search?q=${encodeURIComponent(tag)}`}
                            className="flex items-center gap-1 px-2 py-1 transition-all hover:border-cyan-400"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                color: "var(--secondary)",
                                border: "1px solid var(--border)",
                                background: "var(--surface2)",
                            }}
                        >
                            <Tag size={8} />
                            {tag}
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Post Body */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-8 p-6 md:p-8"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                }}
            >
                <div className="prose-retro">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.body}
                    </ReactMarkdown>
                </div>
            </motion.div>

            {/* Prev/Next navigation */}
            <PixelDivider label="MORE POSTS" color="secondary" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevPost && (
                    <Link href={`/post/${prevPost.slug}`} className="group">
                        <div
                            className="p-4 transition-all h-full"
                            style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <div
                                className="flex items-center gap-2 mb-2"
                                style={{
                                    fontFamily: "var(--font-pixel)",
                                    fontSize: "7px",
                                    color: "var(--text-muted)",
                                }}
                            >
                                <ArrowLeft size={10} />
                                OLDER POST
                            </div>
                            <div
                                className="group-hover:text-orange-400 transition-colors"
                                style={{
                                    fontFamily: "var(--font-pixel)",
                                    fontSize: "8px",
                                    color: "var(--text)",
                                    lineHeight: 1.6,
                                }}
                            >
                                {prevPost.title}
                            </div>
                        </div>
                    </Link>
                )}
                {nextPost && (
                    <Link href={`/post/${nextPost.slug}`} className="group md:text-right">
                        <div
                            className="p-4 transition-all h-full"
                            style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <div
                                className="flex items-center justify-end gap-2 mb-2"
                                style={{
                                    fontFamily: "var(--font-pixel)",
                                    fontSize: "7px",
                                    color: "var(--text-muted)",
                                }}
                            >
                                NEWER POST
                                <ArrowRight size={10} />
                            </div>
                            <div
                                className="group-hover:text-orange-400 transition-colors"
                                style={{
                                    fontFamily: "var(--font-pixel)",
                                    fontSize: "8px",
                                    color: "var(--text)",
                                    lineHeight: 1.6,
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
