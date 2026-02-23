export interface Post {
    id: string;
    title: string;
    slug: string;
    category: string;
    tags: string[];
    excerpt: string;
    body: string;
    published: boolean;
    date: string;
    readTime: number;
    featured?: boolean;
}

export interface PostsData {
    posts: Post[];
}

// Client-side post loading from data/posts.json
export async function fetchPosts(): Promise<Post[]> {
    try {
        const response = await fetch("/data/posts.json");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const posts: Post[] = await response.json();
        return posts.filter((p) => p.published);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export function filterByCategory(posts: Post[], category: string): Post[] {
    return posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
    );
}

export function searchPosts(posts: Post[], query: string): Post[] {
    const q = query.toLowerCase();
    return posts.filter(
        (p) =>
            p.title.toLowerCase().includes(q) ||
            p.body.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)) ||
            p.excerpt.toLowerCase().includes(q)
    );
}

export function getCategories(
    posts: Post[]
): { name: string; count: number }[] {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

export function getAllTags(posts: Post[]): { tag: string; count: number }[] {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
        p.tags.forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
        });
    });
    return Object.entries(counts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
}

export function sortByDate(posts: Post[]): Post[] {
    return [...posts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getFeaturedPosts(posts: Post[]): Post[] {
    return posts.filter((p) => p.featured);
}

export function getPostBySlug(posts: Post[], slug: string): Post | undefined {
    return posts.find((p) => p.slug === slug);
}

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
