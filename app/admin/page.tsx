"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Key,
    Github,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import AdminEditor from "@/components/AdminEditor";
import PixelDivider from "@/components/PixelDivider";
import {
    Post,
    fetchPosts,
    sortByDate,
    formatDate,
} from "@/lib/posts";
import {
    GitHubConfig,
    readPostsFromGitHub,
    writePostsToGitHub,
    getFileSha,
    saveConfig,
    loadConfig,
    validateToken,
} from "@/lib/github";

type Status = "idle" | "loading" | "success" | "error";

const inputStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.82rem",
    color: "var(--text)",
    background: "var(--bg)",
    border: "1px solid var(--border-mid)",
    borderRadius: "3px",
    padding: "8px 12px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
};

const labelStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--amber)",
    display: "block",
    marginBottom: "5px",
};

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [config, setConfig] = useState<GitHubConfig>({
        owner: "",
        repo: "myweb",
        branch: "main",
        token: "",
    });
    const [authStatus, setAuthStatus] = useState<Status>("idle");
    const [authError, setAuthError] = useState("");

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<Status>("idle");
    const [saveMessage, setSaveMessage] = useState("");

    const [editingPost, setEditingPost] = useState<Post | null | undefined>(
        undefined
    );

    useEffect(() => {
        const stored = loadConfig();
        if (stored) setConfig(stored);
    }, []);

    const handleAuth = async () => {
        setAuthStatus("loading");
        setAuthError("");
        const valid = await validateToken(config);
        if (valid) {
            saveConfig(config);
            setAuthed(true);
            setAuthStatus("success");
            loadPosts();
        } else {
            setAuthStatus("error");
            setAuthError("Authentication failed. Check your token and repo details.");
        }
    };

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await readPostsFromGitHub(config);
            setPosts(sortByDate(data));
        } catch {
            const data = await fetchPosts();
            setPosts(sortByDate(data));
        } finally {
            setLoading(false);
        }
    };

    const handleSavePost = async (post: Post) => {
        setSaving(true);
        setSaveStatus("idle");
        try {
            const sha = await getFileSha(config);
            const isNew = !posts.find((p) => p.id === post.id);
            const updated = isNew
                ? [post, ...posts]
                : posts.map((p) => (p.id === post.id ? post : p));
            await writePostsToGitHub(config, updated, sha);
            setPosts(sortByDate(updated));
            setEditingPost(undefined);
            setSaveStatus("success");
            setSaveMessage(
                isNew
                    ? `Post "${post.title}" published! Cloudflare will deploy in ~30s.`
                    : `Post "${post.title}" updated!`
            );
        } catch (err) {
            setSaveStatus("error");
            setSaveMessage(
                err instanceof Error ? err.message : "Failed to save post."
            );
        } finally {
            setSaving(false);
            setTimeout(() => setSaveStatus("idle"), 5000);
        }
    };

    const handleDeletePost = async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

        setSaving(true);
        try {
            const sha = await getFileSha(config);
            const updated = posts.filter((p) => p.id !== postId);
            await writePostsToGitHub(config, updated, sha);
            setPosts(updated);
            setSaveStatus("success");
            setSaveMessage("Post deleted.");
        } catch (err) {
            setSaveStatus("error");
            setSaveMessage(
                err instanceof Error ? err.message : "Failed to delete post."
            );
        } finally {
            setSaving(false);
            setTimeout(() => setSaveStatus("idle"), 4000);
        }
    };

    // --- AUTH SCREEN ---
    if (!authed) {
        return (
            <div
                style={{
                    maxWidth: "480px",
                    margin: "0 auto",
                    padding: "5rem 1.5rem",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border-mid)",
                        borderLeft: "3px solid var(--amber)",
                        borderRadius: "4px",
                        padding: "2rem",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <Shield size={18} style={{ color: "var(--amber)" }} />
                        <div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    color: "var(--text)",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Admin Login
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--amber)",
                                }}
                            >
                                {"// github credentials required"}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>owner</label>
                            <input
                                value={config.owner}
                                onChange={(e) => setConfig((c) => ({ ...c, owner: e.target.value }))}
                                placeholder="github-username"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>repo</label>
                            <input
                                value={config.repo}
                                onChange={(e) => setConfig((c) => ({ ...c, repo: e.target.value }))}
                                placeholder="myweb"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>branch</label>
                            <input
                                value={config.branch}
                                onChange={(e) => setConfig((c) => ({ ...c, branch: e.target.value }))}
                                placeholder="main"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label
                                style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "5px" }}
                            >
                                <Key size={10} />
                                personal access token
                            </label>
                            <input
                                type="password"
                                value={config.token}
                                onChange={(e) => setConfig((c) => ({ ...c, token: e.target.value }))}
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                style={inputStyle}
                            />
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.65rem",
                                    color: "var(--text-faint)",
                                    marginTop: "4px",
                                }}
                            >
                                Needs contents:write scope. Stored in sessionStorage only.
                            </div>
                        </div>
                    </div>

                    {authError && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "1rem",
                                padding: "10px 14px",
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.3)",
                                borderRadius: "3px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "#f87171",
                            }}
                        >
                            <AlertTriangle size={14} />
                            {authError}
                        </div>
                    )}

                    <button
                        onClick={handleAuth}
                        disabled={!config.owner || !config.token || authStatus === "loading"}
                        className="btn-amber"
                        style={{
                            width: "100%",
                            marginTop: "1.5rem",
                            justifyContent: "center",
                            opacity: (!config.owner || !config.token || authStatus === "loading") ? 0.5 : 1,
                        }}
                    >
                        <Github size={14} />
                        {authStatus === "loading" ? "connecting..." : "connect & login"}
                    </button>
                </motion.div>
            </div>
        );
    }

    // --- ADMIN DASHBOARD ---
    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    padding: "1.25rem 1.5rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                }}
            >
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--amber)",
                            marginBottom: "4px",
                        }}
                    >
                        <Shield size={12} />
                        {"/* admin dashboard */"}
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            color: "var(--text)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Post Manager
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--text-faint)",
                            marginTop: "2px",
                        }}
                    >
                        {config.owner}/{config.repo} @ {config.branch}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                        onClick={loadPosts}
                        disabled={loading}
                        className="btn-outline"
                        style={{ opacity: loading ? 0.6 : 1 }}
                    >
                        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        refresh
                    </button>
                    <button
                        onClick={() => setEditingPost(null)}
                        className="btn-amber"
                    >
                        <Plus size={13} />
                        new post
                    </button>
                </div>
            </motion.div>

            {/* Status messages */}
            <AnimatePresence>
                {saveStatus !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "1rem",
                            padding: "10px 14px",
                            background:
                                saveStatus === "success"
                                    ? "rgba(74,222,128,0.08)"
                                    : "rgba(239,68,68,0.08)",
                            border: `1px solid ${saveStatus === "success"
                                ? "rgba(74,222,128,0.3)"
                                : "rgba(239,68,68,0.3)"
                                }`,
                            borderRadius: "3px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.78rem",
                            color: saveStatus === "success" ? "var(--green)" : "#f87171",
                        }}
                    >
                        {saveStatus === "success" ? (
                            <CheckCircle size={14} />
                        ) : (
                            <XCircle size={14} />
                        )}
                        {saveMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <PixelDivider label={`POSTS (${posts.length})`} />

            {/* Posts Table */}
            <div
                style={{
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                }}
            >
                {/* Table header */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0,1fr) 160px 110px 80px 90px",
                        gap: "0",
                        padding: "10px 16px",
                        background: "var(--surface2)",
                        borderBottom: "1px solid var(--border)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        color: "var(--text-faint)",
                    }}
                >
                    <div>TITLE</div>
                    <div>CATEGORY</div>
                    <div>DATE</div>
                    <div>STATUS</div>
                    <div>ACTIONS</div>
                </div>

                {/* Rows */}
                {loading ? (
                    <div
                        style={{
                            padding: "4rem",
                            textAlign: "center",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--amber)",
                        }}
                    >
                        {"// loading posts..."}
                    </div>
                ) : posts.length === 0 ? (
                    <div
                        style={{
                            padding: "4rem",
                            textAlign: "center",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--text-faint)",
                        }}
                    >
                        {"// no posts found"}
                    </div>
                ) : (
                    posts.map((post, i) => (
                        <div
                            key={post.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0,1fr) 160px 110px 80px 90px",
                                gap: "0",
                                padding: "12px 16px",
                                borderBottom: i < posts.length - 1 ? "1px solid var(--border)" : "none",
                                background: "var(--surface)",
                                alignItems: "center",
                                transition: "background 0.1s",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface)")}
                        >
                            {/* Title + slug */}
                            <div style={{ minWidth: 0, paddingRight: "12px" }}>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.82rem",
                                        color: "var(--text)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {post.title}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.65rem",
                                        color: "var(--text-faint)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    /{post.slug}
                                </div>
                            </div>

                            {/* Category */}
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: "var(--text-muted)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    paddingRight: "8px",
                                }}
                            >
                                {post.category}
                            </div>

                            {/* Date */}
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.72rem",
                                    color: "var(--text-faint)",
                                }}
                            >
                                {formatDate(post.date)}
                            </div>

                            {/* Status */}
                            <div>
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.62rem",
                                        color: post.published ? "var(--green)" : "var(--text-faint)",
                                        background: post.published
                                            ? "rgba(74,222,128,0.08)"
                                            : "transparent",
                                        border: `1px solid ${post.published
                                            ? "rgba(74,222,128,0.3)"
                                            : "var(--border)"
                                            }`,
                                        borderRadius: "3px",
                                        padding: "2px 6px",
                                        display: "inline-block",
                                    }}
                                >
                                    {post.published ? "live" : "draft"}
                                </span>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <button
                                    onClick={() => setEditingPost(post)}
                                    title="Edit"
                                    style={{
                                        padding: "6px",
                                        color: "var(--text-muted)",
                                        background: "none",
                                        border: "1px solid transparent",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                        transition: "color 0.15s, border-color 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.color = "var(--amber)";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-mid)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                                    }}
                                >
                                    <Edit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    disabled={saving}
                                    title="Delete"
                                    style={{
                                        padding: "6px",
                                        color: "var(--text-muted)",
                                        background: "none",
                                        border: "1px solid transparent",
                                        borderRadius: "3px",
                                        cursor: saving ? "not-allowed" : "pointer",
                                        opacity: saving ? 0.4 : 1,
                                        transition: "color 0.15s, border-color 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!saving) {
                                            (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Editor Modal */}
            <AnimatePresence>
                {editingPost !== undefined && (
                    <AdminEditor
                        post={editingPost}
                        onSave={handleSavePost}
                        onCancel={() => setEditingPost(undefined)}
                        saving={saving}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
