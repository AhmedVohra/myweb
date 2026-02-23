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
};

const labelStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--amber)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "5px",
};

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
        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        onSave({ ...form, tags });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                background: "rgba(0,0,0,0.8)",
            }}
        >
            <motion.div
                initial={{ scale: 0.98, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 12 }}
                style={{
                    width: "100%",
                    maxWidth: "860px",
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--surface)",
                    border: "1px solid var(--border-mid)",
                    borderRadius: "6px",
                    overflow: "hidden",
                }}
            >
                {/* Modal Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 20px",
                        borderBottom: "1px solid var(--border)",
                        background: "var(--surface2)",
                        flexShrink: 0,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.65rem",
                                color: "var(--amber)",
                                marginBottom: "2px",
                            }}
                        >
                            {isNew ? "// new_post" : "// edit_post"}
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "1rem",
                                color: "var(--text)",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {isNew ? "New Post" : "Edit Post"}
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                            onClick={() => setPreview(!preview)}
                            className="btn-outline"
                            style={{ padding: "6px 12px", fontSize: "0.72rem" }}
                        >
                            {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                            {preview ? "edit" : "preview"}
                        </button>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: "6px",
                                color: "var(--text-muted)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "3px",
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body — scrollable */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    {/* Title */}
                    <div>
                        <label style={labelStyle}>
                            <Type size={11} />
                            title
                        </label>
                        <input
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            placeholder="Post title..."
                            style={{ ...inputStyle, fontSize: "1rem", fontFamily: "var(--font-display)", fontWeight: 600 }}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label style={labelStyle}>slug</label>
                        <input
                            value={form.slug}
                            onChange={(e) => update("slug", e.target.value)}
                            placeholder="post-slug-url"
                            style={{ ...inputStyle, color: "var(--green)" }}
                        />
                    </div>

                    {/* Category + Date + ReadTime */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        <div>
                            <label style={labelStyle}>category</label>
                            <select
                                value={form.category}
                                onChange={(e) => update("category", e.target.value)}
                                style={inputStyle}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>
                                <Calendar size={11} />
                                date
                            </label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => update("date", e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>read time (min)</label>
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
                        <label style={labelStyle}>
                            <Tag size={11} />
                            tags (comma separated)
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
                        <label style={labelStyle}>excerpt</label>
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
                        <label style={labelStyle}>
                            <AlignLeft size={11} />
                            body (markdown)
                        </label>
                        <textarea
                            value={form.body}
                            onChange={(e) => update("body", e.target.value)}
                            placeholder={"# Post Title\n\nWrite your post in Markdown..."}
                            rows={16}
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                                lineHeight: 1.6,
                                minHeight: "300px",
                            }}
                        />
                    </div>

                    {/* Toggles */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <Toggle
                            label="published"
                            checked={form.published}
                            onChange={(v) => update("published", v)}
                        />
                        <Toggle
                            label="featured"
                            checked={!!form.featured}
                            onChange={(v) => update("featured", v)}
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "10px",
                        padding: "14px 20px",
                        borderTop: "1px solid var(--border)",
                        background: "var(--surface2)",
                        flexShrink: 0,
                    }}
                >
                    <button
                        onClick={onCancel}
                        className="btn-outline"
                    >
                        cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.title}
                        className="btn-amber"
                        style={{ opacity: saving || !form.title ? 0.5 : 1 }}
                    >
                        <Save size={13} />
                        {saving ? "committing..." : "save & commit"}
                    </button>
                </div>
            </motion.div>
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
        <label
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "10px",
                    background: checked ? "var(--amber)" : "var(--surface3)",
                    border: `1px solid ${checked ? "var(--amber)" : "var(--border-mid)"}`,
                    position: "relative",
                    transition: "background 0.2s, border-color 0.2s",
                    flexShrink: 0,
                }}
                onClick={() => onChange(!checked)}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "2px",
                        width: "14px",
                        height: "14px",
                        borderRadius: "7px",
                        background: checked ? "var(--bg)" : "var(--text-faint)",
                        left: checked ? "calc(100% - 16px)" : "2px",
                        transition: "left 0.2s, background 0.2s",
                    }}
                />
            </div>
            <span
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: checked ? "var(--amber)" : "var(--text-muted)",
                }}
            >
                {label}
            </span>
        </label>
    );
}
