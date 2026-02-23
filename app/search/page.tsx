"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import PostGrid from "@/components/PostGrid";
import Sidebar from "@/components/Sidebar";
import PixelDivider from "@/components/PixelDivider";
import SearchBar from "@/components/SearchBar";
import { Post, fetchPosts, searchPosts, sortByDate } from "@/lib/posts";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
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
                style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "10px",
                    color: "var(--primary)",
                }}
            >
                SEARCHING...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-bright)",
                }}
            >
                <div
                    className="flex items-center gap-3 mb-4"
                    style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "7px",
                        color: "var(--accent)",
                    }}
                >
                    <Search size={12} />
                    SEARCH TERMINAL
                </div>
                <SearchBar />
                {query && (
                    <div
                        className="mt-3"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "14px",
                            color: "var(--text-muted)",
                        }}
                    >
                        &gt; query:{" "}
                        <span style={{ color: "var(--accent)" }}>&quot;{query}&quot;</span>{" "}
                        — {results.length} result{results.length !== 1 ? "s" : ""} found
                    </div>
                )}
            </motion.div>

            <PixelDivider label="RESULTS" color="accent" />

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
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
                    style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "10px",
                        color: "var(--primary)",
                    }}
                >
                    LOADING...
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}
