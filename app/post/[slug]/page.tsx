import fs from "fs";
import path from "path";
import PostClient from "./PostClient";

interface Post {
    slug: string;
    category: string;
}

export function generateStaticParams(): { slug: string }[] {
    const filePath = path.join(process.cwd(), "public", "data", "posts.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const posts: Post[] = JSON.parse(raw);
    return posts.map((p) => ({ slug: p.slug }));
}

export default function PostPage() {
    return <PostClient />;
}
