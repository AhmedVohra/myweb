import { Post } from "./posts";

export interface GitHubConfig {
    owner: string;
    repo: string;
    branch: string;
    token: string;
}

const DATA_PATH = "data/posts.json";

// Read posts from GitHub repo
export async function readPostsFromGitHub(config: GitHubConfig): Promise<Post[]> {
    const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${DATA_PATH}?ref=${config.branch}`,
        {
            headers: {
                Authorization: `token ${config.token}`,
                Accept: "application/vnd.github.v3+json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = atob(data.content.replace(/\n/g, ""));
    return JSON.parse(content);
}

// Write posts to GitHub repo (creates a commit)
export async function writePostsToGitHub(
    config: GitHubConfig,
    posts: Post[],
    sha: string
): Promise<void> {
    const content = btoa(
        unescape(encodeURIComponent(JSON.stringify(posts, null, 2)))
    );

    const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${DATA_PATH}`,
        {
            method: "PUT",
            headers: {
                Authorization: `token ${config.token}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `docs: update posts.json [${new Date().toISOString()}]`,
                content,
                sha,
                branch: config.branch,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to write to GitHub");
    }
}

// Get the current SHA of posts.json (needed for updates)
export async function getFileSha(config: GitHubConfig): Promise<string> {
    const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${DATA_PATH}?ref=${config.branch}`,
        {
            headers: {
                Authorization: `token ${config.token}`,
                Accept: "application/vnd.github.v3+json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Cannot read file SHA: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sha;
}

// Save config to sessionStorage
export function saveConfig(config: GitHubConfig): void {
    sessionStorage.setItem("gh_config", JSON.stringify(config));
}

// Load config from sessionStorage
export function loadConfig(): GitHubConfig | null {
    const stored = sessionStorage.getItem("gh_config");
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

// Validate token has repo access
export async function validateToken(config: GitHubConfig): Promise<boolean> {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${config.owner}/${config.repo}`,
            {
                headers: {
                    Authorization: `token ${config.token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );
        return response.ok;
    } catch {
        return false;
    }
}
