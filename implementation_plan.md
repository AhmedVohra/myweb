# Add "Import Markdown" Feature to Admin Editor

When creating a new post, you currently have to manually fill in every field (title, slug, tags, body, etc.). This feature adds an **"Import .md"** button that lets you paste or upload a raw markdown file and have it auto-populate the editor form.

## How It Works

1. A new **"import .md"** button appears in the AdminEditor header (next to the preview toggle) when creating a new post
2. Clicking it opens a small modal with a textarea where you paste your [.md](file:///c:/Users/ahmed/OneDrive/Documents/GitHub/myweb/SETUP.md) file content
3. The parser extracts:
   - **Title** → from the first `# heading`
   - **Body** → the full markdown content
   - **Excerpt** → first paragraph after the title (auto-truncated to ~200 chars)
   - **Slug** → auto-generated from the title
   - **Read time** → estimated from word count (~200 words/min)
4. You review/adjust the auto-filled fields (category, tags, etc.), then save as normal

## Proposed Changes

### AdminEditor Component

#### [MODIFY] [AdminEditor.tsx](file:///c:/Users/ahmed/OneDrive/Documents/GitHub/myweb/components/AdminEditor.tsx)

- Add `FileUp` icon import from lucide-react
- Add `showImport` state toggle
- Add `handleImportMarkdown(mdText: string)` function that parses the markdown and fills the form:
  - Extracts title from first `# ` line
  - Sets body to the full markdown text
  - Auto-generates slug, excerpt, and read time
- Add an **"import .md"** button in the modal header (visible only for new posts)
- Add a collapsible import panel with a textarea + "apply" button, shown when `showImport` is true

No new files or dependencies needed — this is a self-contained addition to the existing component.

## Verification Plan

### Manual Verification
1. Run `npm run dev` and go to `http://localhost:3000/admin`
2. Log in with GitHub credentials
3. Click **"new post"**
4. Click **"import .md"** button in the editor header
5. Paste the contents of [bc-restore-production-license-fix.md.resolved](file:///c:/Users/ahmed/OneDrive/Documents/GitHub/myweb/bc-restore-production-license-fix.md.resolved) into the import textarea
6. Click "apply" — verify the title, slug, excerpt, body, and read time fields are auto-filled
7. Adjust category/tags as needed, then save
