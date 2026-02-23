# BC.KNOWLEDGE — Setup Guide

## Step 1: Push to GitHub

If `myweb` isn't already on GitHub:

```powershell
cd "c:\Users\ahmed\OneDrive\Documents\GitHub\myweb"
git remote add origin https://github.com/YOUR_USERNAME/myweb.git
git branch -M main
git push -u origin main
```

---

## Step 2: Generate a GitHub Personal Access Token (PAT)

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Click **Generate new token**
3. Set:
   - **Token name**: `bc-knowledge-admin`
   - **Repository access**: Only select repositories → choose `myweb`
   - **Permissions → Repository permissions → Contents**: **Read and write**
4. Click **Generate token** and **copy it** — you won't see it again
5. Paste it in the Admin panel when prompted

> **Security note:** The token is stored only in your browser's `sessionStorage` — it's cleared when you close the tab and never sent to any server.

---

## Step 3: Connect Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project**
2. Click **Connect to Git** → Authorize GitHub → Select the `myweb` repo
3. Configure the build:

| Setting | Value |
|---------|-------|
| **Framework preset** | Next.js (Static HTML Export) |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

4. Click **Save and Deploy**

Cloudflare Pages will automatically redeploy every time you push to `main` — including when the Admin panel commits a new post.

---

## Step 4: Using the Admin Panel

1. Navigate to `https://your-site.pages.dev/admin`
2. Enter:
   - **GitHub Owner**: your GitHub username
   - **Repository**: `myweb`
   - **Branch**: `main`
   - **Token**: the PAT from Step 2
3. Click **Connect & Login**
4. Use **New Post** to create posts — each save commits to `data/posts.json`
5. Cloudflare deploys automatically in ~30 seconds

---

## Local Development

```powershell
npm run dev
# Open http://localhost:3000
```

> **Note:** Search and posts load via `fetch()` from `/data/posts.json` — this works with the dev server. The admin panel's GitHub API features require a real GitHub repo.
