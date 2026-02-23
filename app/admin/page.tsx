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
    generateSlug,
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

    // Load stored config on mount
    useEffect(() => {
        const stored = loadConfig();
        if (stored) {
            setConfig(stored);
        }
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
            setAuthError(
                "Authentication failed. Check your token and repo details."
            );
        }
    };

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await readPostsFromGitHub(config);
            setPosts(sortByDate(data));
        } catch {
            // Fall back to local posts.json
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
            setSaveMessage(`Post deleted.`);
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

    const inputStyle = {
        fontFamily: "var(--font-mono)",
        fontSize: "14px",
        color: "var(--text)",
        background: "var(--bg)",
        border: "1px solid var(--border-bright)",
        padding: "8px 12px",
        width: "100%",
        outline: "none",
    };

    const labelStyle = {
        fontFamily: "var(--font-pixel)",
        fontSize: "7px",
        color: "var(--text-muted)",
        display: "block",
        marginBottom: "4px",
    };

    // --- AUTH SCREEN ---
    if (!authed) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border-bright)",
                        boxShadow: "0 0 30px var(--primary-glow)",
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Shield size={20} style={{ color: "var(--primary)" }} />
                        <span
                            style={{
                                fontFamily: "var(--font-pixel)",
                                fontSize: "10px",
                                color: "var(--primary)",
                            }}
                        >
                            ADMIN TERMINAL
                        </span>
                    </div>

                    <div
                        className="mb-6"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "14px",
                            color: "var(--text-muted)",
                        }}
                    >
                        &gt; Enter your GitHub credentials to access the post management
                        system.
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label style={labelStyle}>GITHUB OWNER (username)</label>
                            <input
                                value={config.owner}
                                onChange={(e) =>
                                    setConfig((c) => ({ ...c, owner: e.target.value }))
                                }
                                placeholder="your-github-username"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>REPOSITORY NAME</label>
                            <input
                                value={config.repo}
                                onChange={(e) =>
                                    setConfig((c) => ({ ...c, repo: e.target.value }))
                                }
                                placeholder="myweb"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>BRANCH</label>
                            <input
                                value={config.branch}
                                onChange={(e) =>
                                    setConfig((c) => ({ ...c, branch: e.target.value }))
                                }
                                placeholder="main"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle} className="flex items-center gap-1">
                                <Key size={7} /> GITHUB PERSONAL ACCESS TOKEN
                            </label>
                            <input
                                type="password"
                                value={config.token}
                                onChange={(e) =>
                                    setConfig((c) => ({ ...c, token: e.target.value }))
                                }
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                style={inputStyle}
                            />
                            <div
                                className="mt-1"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "11px",
                                    color: "var(--text-muted)",
                                }}
                            >
                                Needs contents:write scope. Stored in sessionStorage only.
                            </div>
                        </div>
                    </div>

                    {authError && (
                        <div
                            className="flex items-center gap-2 mt-4 p-3"
                            style={{
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.4)",
                                fontFamily: "var(--font-mono)",
                                fontSize: "13px",
                                color: "#f87171",
                            }}
                        >
                            <AlertTriangle size={14} />
                            {authError}
                        </div>
                    )}

                    <button
                        onClick={handleAuth}
                        disabled={
                            !config.owner || !config.token || authStatus === "loading"
                        }
                        className="w-full flex items-center justify-center gap-2 mt-6 py-3 transition-all disabled:opacity-50"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--bg)",
                            background: "var(--primary)",
                            boxShadow: "0 0 12px var(--primary-glow)",
                        }}
                    >
                        <Github size={12} />
                        {authStatus === "loading" ? "AUTHENTICATING..." : "CONNECT & LOGIN"}
                    </button>
                </motion.div>
            </div>
        );
    }

    // --- ADMIN DASHBOARD ---
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6 p-5"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-bright)",
                }}
            >
                <div>
                    <div
                        className="flex items-center gap-2 mb-1"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--green)",
                        }}
                    >
                        <Shield size={12} />
                        ADMIN DASHBOARD
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            color: "var(--text-muted)",
                        }}
                    >
                        {config.owner}/{config.repo} @ {config.branch}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadPosts}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 transition-all"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "7px",
                            color: "var(--secondary)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
                        REFRESH
                    </button>
                    <button
                        onClick={() => setEditingPost(null)}
                        className="flex items-center gap-2 px-4 py-2 transition-all"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "7px",
                            color: "var(--bg)",
                            background: "var(--primary)",
                            boxShadow: "0 0 10px var(--primary-glow)",
                        }}
                    >
                        <Plus size={10} />
                        NEW POST
                    </button>
                </div>
            </motion.div>

            {/* Status messages */}
            <AnimatePresence>
                {saveStatus !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 mb-4 p-3"
                        style={{
                            background:
                                saveStatus === "success"
                                    ? "rgba(74,222,128,0.1)"
                                    : "rgba(239,68,68,0.1)",
                            border: `1px solid ${saveStatus === "success"
                                    ? "rgba(74,222,128,0.4)"
                                    : "rgba(239,68,68,0.4)"
                                }`,
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
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
                className="overflow-x-auto"
                style={{
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                }}
            >
                {/* Table header */}
                <div
                    className="grid gap-px px-4 py-2 border-b"
                    style={{
                        gridTemplateColumns: "1fr 180px 120px 80px 100px",
                        borderColor: "var(--border)",
                        background: "var(--bg)",
                        fontFamily: "var(--font-pixel)",
                        fontSize: "7px",
                        color: "var(--text-muted)",
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
                        className="p-8 text-center loading-pulse"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "8px",
                            color: "var(--text-muted)",
                        }}
                    >
                        LOADING POSTS...
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="grid gap-px px-4 py-3 border-b transition-colors hover:bg-surface2"
                            style={{
                                gridTemplateColumns: "1fr 180px 120px 80px 100px",
                                borderColor: "var(--border)",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "13px",
                                        color: "var(--text)",
                                    }}
                                >
                                    {post.title}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "11px",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    /{post.slug}
                                </div>
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "12px",
                                    color: "var(--secondary)",
                                }}
                            >
                                {post.category}
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "12px",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {formatDate(post.date)}
                            </div>
                            <div>
                                <span
                                    className="px-2 py-0.5"
                                    style={{
                                        fontFamily: "var(--font-pixel)",
                                        fontSize: "6px",
                                        color: post.published ? "var(--green)" : "var(--text-muted)",
                                        border: `1px solid ${post.published
                                                ? "rgba(74,222,128,0.4)"
                                                : "var(--border)"
                                            }`,
                                        background: post.published
                                            ? "rgba(74,222,128,0.08)"
                                            : "transparent",
                                    }}
                                >
                                    {post.published ? "LIVE" : "DRAFT"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingPost(post)}
                                    className="p-1.5 transition-all hover:text-orange-400"
                                    title="Edit"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    <Edit size={13} />
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    disabled={saving}
                                    className="p-1.5 transition-all hover:text-red-400 disabled:opacity-30"
                                    title="Delete"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    <Trash2 size={13} />
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
