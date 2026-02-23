"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import PostGrid from "@/components/PostGrid";
import Sidebar from "@/components/Sidebar";
import PixelDivider from "@/components/PixelDivider";
import SearchBar from "@/components/SearchBar";
import { Post, fetchPosts, searchPosts, sortByDate } from "@/lib/posts";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams?.get("q") || "";

    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [results, setResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts().then((data) => {
            const sorted = sortByDate(data);
            setAllPosts(sorted);
            setResults(query ? searchPosts(sorted, query) : sorted);
            setLoading(false);
        });
    }, [query]);

    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-[50vh]"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--amber)" }}
            >
                {"// searching..."}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: "2rem" }}
            >
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--amber)",
                        marginBottom: "1rem",
                    }}
                >
                    {"/* search */"}
                </div>
                <h1
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                        color: "var(--text)",
                        letterSpacing: "-0.025em",
                        marginBottom: "1.5rem",
                    }}
                >
                    Search Posts
                </h1>
                <SearchBar />
                {query && (
                    <div
                        style={{
                            marginTop: "0.75rem",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        {">"} query:{" "}
                        <span style={{ color: "var(--amber)" }}>&quot;{query}&quot;</span>
                        {" "}— {results.length} result{results.length !== 1 ? "s" : ""} found
                    </div>
                )}
            </motion.div>

            <PixelDivider label={query ? `results for "${query}"` : "ALL POSTS"} />

            <div className="flex flex-col lg:flex-row gap-6">
                <div style={{ flex: 1, minWidth: 0 }}>
                    <PostGrid posts={results} />
                </div>
                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                    <Sidebar posts={allPosts} />
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div
                    className="flex items-center justify-center min-h-screen"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--amber)" }}
                >
                    {"// loading..."}
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}
