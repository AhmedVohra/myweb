"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
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
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "0.5rem",
        }}
      >
        <div
          className="loading-pulse"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--amber)",
          }}
        >
          {"// loading posts..."}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ marginBottom: "4rem" }}
      >
        {/* Comment label */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--amber)",
            marginBottom: "1.25rem",
          }}
        >
          {"/* welcome */"}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "var(--text)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          The AL Developer&apos;s{" "}
          <span
            style={{
              color: "var(--amber)",
              position: "relative",
              display: "inline-block",
            }}
          >
            Knowledgebase
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            lineHeight: 1.75,
            maxWidth: "560px",
            marginBottom: "2rem",
          }}
        >
          Tutorials, patterns, tips, and deep dives on Business Central &amp; Dynamics
          365 AL development. Built for developers, by a developer.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "3rem" }}>
          <Link href="/search" className="btn-amber">
            <BookOpen size={14} />
            Browse Posts
            <ArrowRight size={13} />
          </Link>
          <Link href="/category/AL Development" className="btn-outline">
            <Layers size={14} />
            AL Development
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1px", border: "1px solid var(--border)", borderRadius: "4px", overflow: "hidden" }}>
          {[
            { label: "posts", value: posts.length, color: "var(--amber)" },
            { label: "featured", value: getFeaturedPosts(posts).length, color: "var(--green)" },
            { label: "status", value: "online", color: "var(--green)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                flex: "1 1 120px",
                padding: "1rem 1.25rem",
                background: "var(--surface)",
                borderRight: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color,
                  letterSpacing: "-0.02em",
                  marginBottom: "2px",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: "var(--text-faint)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Featured Post */}
      {featured && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: "3rem" }}
        >
          <PixelDivider label="FEATURED POST" />
          <Link href={`/post/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div
              className="card-code"
              style={{ padding: "2rem" }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
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
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--text-faint)",
                  }}
                >
                  {featured.category}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                  marginBottom: "0.75rem",
                }}
              >
                {featured.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  maxWidth: "680px",
                  lineHeight: 1.7,
                  marginBottom: "1.25rem",
                }}
              >
                {featured.excerpt}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--amber)",
                }}
              >
                read() <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* All Posts */}
      <PixelDivider label="ALL POSTS" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
        className="lg:flex-row"
      >
        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <PostGrid posts={posts} />
        </div>
        {/* Sidebar */}
        <div
          style={{ width: "100%", flexShrink: 0 }}
          className="lg:w-72 xl:w-80"
        >
          <Sidebar posts={posts} />
        </div>
      </div>
    </div>
  );
}
