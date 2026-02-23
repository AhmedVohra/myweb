import fs from "fs";
import path from "path";
import CategoryClient from "./CategoryClient";

interface Post {
    category: string;
}

export function generateStaticParams(): { name: string }[] {
    const filePath = path.join(process.cwd(), "data", "posts.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const posts: Post[] = JSON.parse(raw);
    const categories = [...new Set(posts.map((p) => p.category))];
    return categories.map((name) => ({ name }));
}

export default function CategoryPage() {
    return <CategoryClient />;
}
