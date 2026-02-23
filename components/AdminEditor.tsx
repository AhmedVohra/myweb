"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, X, Tag, Calendar, Type, AlignLeft, Eye, EyeOff } from "lucide-react";
import { Post, generateSlug } from "@/lib/posts";

interface AdminEditorProps {
    post?: Post | null;
    onSave: (post: Post) => void;
    onCancel: () => void;
    saving: boolean;
}

const CATEGORIES = [
    "AL Development",
    "Performance",
    "Integrations",
    "DevOps",
    "Best Practices",
    "Tips & Tricks",
];

export default function AdminEditor({
    post,
    onSave,
    onCancel,
    saving,
}: AdminEditorProps) {
    const isNew = !post?.id;

    const [form, setForm] = useState<Post>(
        post ?? {
            id: Date.now().toString(),
            title: "",
            slug: "",
            category: CATEGORIES[0],
            tags: [],
            excerpt: "",
            body: "",
            published: false,
            date: new Date().toISOString().split("T")[0],
            readTime: 5,
            featured: false,
        }
    );

    const [tagsInput, setTagsInput] = useState(form.tags.join(", "));
    const [preview, setPreview] = useState(false);

    const update = (field: keyof Post, value: unknown) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value };
            if (field === "title" && isNew) {
                updated.slug = generateSlug(value as string);
            }
            return updated;
        });
    };

    const handleSave = () => {
        const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
        onSave({ ...form, tags });
    };

    const labelStyle = {
        fontFamily: "var(--font-pixel)",
        fontSize: "7px",
        color: "var(--text-muted)",
        letterSpacing: "0.5px",
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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
        >
            <div
                className="w-full max-w-4xl max-h-[90vh] flex flex-col"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-bright)",
                    boxShadow: "0 0 40px var(--primary-glow)",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-3 border-b"
                    style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "9px",
                            color: "var(--primary)",
                        }}
                    >
                        {isNew ? "// NEW POST" : "// EDIT POST"}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPreview(!preview)}
                            className="flex items-center gap-2 px-3 py-1.5 transition-all"
                            style={{
                                fontFamily: "var(--font-pixel)",
                                fontSize: "7px",
                                color: preview ? "var(--accent)" : "var(--text-muted)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            {preview ? <EyeOff size={10} /> : <Eye size={10} />}
                            {preview ? "EDIT" : "PREVIEW"}
                        </button>
                        <button
                            onClick={onCancel}
                            style={{ color: "var(--text-muted)" }}
                            className="p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                            <Type size={8} /> TITLE
                        </label>
                        <input
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            placeholder="Post title..."
                            style={inputStyle}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                            SLUG
                        </label>
                        <input
                            value={form.slug}
                            onChange={(e) => update("slug", e.target.value)}
                            placeholder="post-slug-url"
                            style={{ ...inputStyle, color: "var(--secondary)" }}
                        />
                    </div>

                    {/* Category + Date + ReadTime row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                                <Folder_ /> CATEGORY
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => update("category", e.target.value)}
                                style={{ ...inputStyle }}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                                <Calendar size={8} /> DATE
                            </label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => update("date", e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                                READ TIME (min)
                            </label>
                            <input
                                type="number"
                                value={form.readTime}
                                onChange={(e) => update("readTime", parseInt(e.target.value))}
                                min={1}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                            <Tag size={8} /> TAGS (comma separated)
                        </label>
                        <input
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="AL, Business Central, Performance"
                            style={inputStyle}
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                            EXCERPT
                        </label>
                        <textarea
                            value={form.excerpt}
                            onChange={(e) => update("excerpt", e.target.value)}
                            placeholder="Short description shown on post cards..."
                            rows={2}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    {/* Body */}
                    <div>
                        <label className="flex items-center gap-1 mb-1" style={labelStyle}>
                            <AlignLeft size={8} /> BODY (Markdown)
                        </label>
                        <textarea
                            value={form.body}
                            onChange={(e) => update("body", e.target.value)}
                            placeholder="# Post Title&#10;&#10;Write your post in Markdown..."
                            rows={14}
                            style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                        />
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center gap-6">
                        <Toggle
                            label="PUBLISHED"
                            checked={form.published}
                            onChange={(v) => update("published", v)}
                        />
                        <Toggle
                            label="FEATURED"
                            checked={!!form.featured}
                            onChange={(v) => update("featured", v)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="flex items-center justify-end gap-3 px-5 py-3 border-t"
                    style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                >
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 transition-all"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "7px",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.title}
                        className="flex items-center gap-2 px-4 py-2 transition-all disabled:opacity-50"
                        style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "7px",
                            color: "var(--bg)",
                            background: "var(--primary)",
                            border: "1px solid var(--primary)",
                            boxShadow: saving ? "none" : "0 0 10px var(--primary-glow)",
                        }}
                    >
                        <Save size={10} />
                        {saving ? "COMMITTING..." : "SAVE & COMMIT"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <div
                className="w-8 h-4 relative transition-colors"
                style={{
                    background: checked ? "var(--primary)" : "var(--surface2)",
                    border: "1px solid var(--border-bright)",
                }}
                onClick={() => onChange(!checked)}
            >
                <div
                    className="absolute top-0.5 w-3 h-3 transition-all"
                    style={{
                        left: checked ? "calc(100% - 14px)" : "2px",
                        background: checked ? "var(--bg)" : "var(--text-muted)",
                    }}
                />
            </div>
            <span
                style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    color: checked ? "var(--primary)" : "var(--text-muted)",
                }}
            >
                {label}
            </span>
        </label>
    );
}

// Inline folder icon since Lucide doesn't export Folder_ 
function Folder_() {
    return (
        <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    );
}
