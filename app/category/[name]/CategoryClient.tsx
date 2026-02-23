"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import PostGrid from "@/components/PostGrid";
import Sidebar from "@/components/Sidebar";
import PixelDivider from "@/components/PixelDivider";
import {
    Post,
    fetchPosts,
    filterByCategory,
    sortByDate,
} from "@/lib/posts";

export default function CategoryPage() {
    const params = useParams();
    const categoryName = decodeURIComponent(params?.name as string);

    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [filtered, setFiltered] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts().then((data) => {
            const sorted = sortByDate(data);
            setAllPosts(sorted);
            setFiltered(filterByCategory(sorted, categoryName));
            setLoading(false);
        });
    }, [categoryName]);

    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--amber)" }}
            >
                {"// loading..."}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: "2.5rem" }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--amber)",
                        marginBottom: "0.75rem",
                    }}
                >
                    <Folder size={13} />
                    {"/* category */"}
                </div>
                <h1
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                        color: "var(--text)",
                        letterSpacing: "-0.025em",
                        marginBottom: "0.5rem",
                    }}
                >
                    {categoryName}
                </h1>
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                    }}
                >
                    {filtered.length} post{filtered.length !== 1 ? "s" : ""} found
                </div>
            </motion.div>

            <PixelDivider label="POSTS" />

            <div className="flex flex-col lg:flex-row gap-6">
                <div style={{ flex: 1, minWidth: 0 }}>
                    <PostGrid posts={filtered} />
                </div>
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <Sidebar posts={allPosts} activeCategory={categoryName} />
                </div>
            </div>
        </div>
    );
}
