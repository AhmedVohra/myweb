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
                style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "10px",
                    color: "var(--primary)",
                }}
            >
                LOADING...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-bright)",
                    boxShadow: "0 0 20px rgba(34,211,238,0.08)",
                }}
            >
                <div
                    className="flex items-center gap-3 mb-2"
                    style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "7px",
                        color: "var(--secondary)",
                    }}
                >
                    <Folder size={12} />
                    CATEGORY
                </div>
                <h1
                    className="glow-secondary"
                    style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "clamp(12px, 2.5vw, 20px)",
                        color: "var(--secondary)",
                        lineHeight: 1.6,
                    }}
                >
                    {categoryName}
                </h1>
                <div
                    className="mt-2"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "14px",
                        color: "var(--text-muted)",
                    }}
                >
                    {filtered.length} post{filtered.length !== 1 ? "s" : ""} found
                </div>
            </motion.div>

            <PixelDivider label="POSTS" color="secondary" />

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                    <PostGrid posts={filtered} />
                </div>
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <Sidebar posts={allPosts} activeCategory={categoryName} />
                </div>
            </div>
        </div>
    );
}
