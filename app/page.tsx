"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Database } from "lucide-react";
import PostGrid from "@/components/PostGrid";
import Sidebar from "@/components/Sidebar";
import PixelDivider from "@/components/PixelDivider";
import { Post, fetchPosts, sortByDate, getFeaturedPosts } from "@/lib/posts";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(sortByDate(data));
      setLoading(false);
    });
  }, []);

  const featured = getFeaturedPosts(posts)[0];

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-6"
        style={{ color: "var(--primary)" }}
      >
        <div
          className="loading-pulse"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "12px",
          }}
        >
          LOADING KNOWLEDGE BASE...
        </div>
        <div
          style={{
            fontFamily: "var(--font-terminal)",
            fontSize: "20px",
            color: "var(--text-muted)",
          }}
        >
          &gt; Fetching records from database_
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-10 p-6 md:p-10 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--surface) 0%, #0f1e3a 100%)",
          border: "1px solid var(--border-bright)",
          boxShadow: "0 0 40px rgba(249,115,22,0.1)",
        }}
      >
        {/* Decorative scanline inside hero */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(249,115,22,0.05) 3px, rgba(249,115,22,0.05) 4px)",
          }}
        />

        {/* Corner decorations */}
        <span
          className="absolute top-3 left-3"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--primary)",
            opacity: 0.5,
          }}
        >
          ▮
        </span>
        <span
          className="absolute bottom-3 right-3"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--primary)",
            opacity: 0.5,
          }}
        >
          ▮
        </span>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <div
              className="mb-3"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "8px",
                color: "var(--secondary)",
                letterSpacing: "2px",
              }}
            >
              &gt;&gt; WELCOME TO THE TERMINAL
            </div>
            <h1
              className="glow-primary mb-4"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "clamp(14px, 3vw, 24px)",
                color: "var(--primary)",
                lineHeight: 1.5,
              }}
            >
              BC.KNOWLEDGE
              <span
                className="cursor-blink"
                style={{ color: "var(--secondary)", display: "inline" }}
              />
            </h1>
            <p
              className="mb-6 max-w-2xl"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "16px",
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              An AL Developer&apos;s personal knowledge base — tutorials,
              patterns, tips, and deep dives on Business Central & Dynamics 365
              development.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/search"
                className="flex items-center gap-2 px-4 py-2 transition-all hover:shadow-lg"
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "8px",
                  color: "var(--bg)",
                  background: "var(--primary)",
                  boxShadow: "0 0 12px var(--primary-glow)",
                }}
              >
                <Zap size={10} />
                SEARCH POSTS
                <ArrowRight size={10} />
              </Link>
              <Link
                href="/category/AL Development"
                className="flex items-center gap-2 px-4 py-2 transition-all"
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "8px",
                  color: "var(--secondary)",
                  border: "1px solid var(--secondary)",
                  background: "rgba(34,211,238,0.05)",
                }}
              >
                <Database size={10} />
                BROWSE AL DEV
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex flex-row md:flex-col gap-4"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--text-muted)",
            }}
          >
            {[
              { label: "POSTS", value: posts.length, color: "var(--primary)" },
              {
                label: "FEATURED",
                value: getFeaturedPosts(posts).length,
                color: "var(--accent)",
              },
              {
                label: "STATUS",
                value: "ONLINE",
                color: "var(--green)",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="text-center p-3 border"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg)",
                  minWidth: "80px",
                }}
              >
                <div style={{ color, fontSize: "14px", marginBottom: "4px" }}>
                  {value}
                </div>
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Featured Post */}
      {featured && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <PixelDivider label="FEATURED POST" />
          <Link href={`/post/${featured.slug}`} className="block group">
            <div
              className="card-scan pixel-corner p-6 md:p-8 transition-all"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-bright)",
              }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className="px-2 py-1"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "6px",
                    color: "var(--primary)",
                    border: "1px solid var(--primary)",
                    background: "rgba(249,115,22,0.1)",
                  }}
                >
                  ★ FEATURED
                </span>
                <span
                  className="px-2 py-1"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "6px",
                    color: "var(--secondary)",
                    border: "1px solid var(--secondary)",
                    background: "rgba(34,211,238,0.08)",
                  }}
                >
                  {featured.category}
                </span>
              </div>
              <h2
                className="mb-3 group-hover:text-orange-400 transition-colors"
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "clamp(11px, 2vw, 16px)",
                  color: "var(--text)",
                  lineHeight: 1.6,
                }}
              >
                {featured.title}
              </h2>
              <p
                className="mb-4"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  color: "var(--text-muted)",
                  maxWidth: "700px",
                }}
              >
                {featured.excerpt}
              </p>
              <span
                className="flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "8px",
                  color: "var(--primary)",
                }}
              >
                READ FULL POST <ArrowRight size={10} />
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Main content grid */}
      <PixelDivider label="ALL POSTS" />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Posts */}
        <div className="flex-1 min-w-0">
          <PostGrid posts={posts} />
        </div>
        {/* Sidebar */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <Sidebar posts={posts} />
        </div>
      </div>
    </div>
  );
}
