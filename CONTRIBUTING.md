# Contributing to Verid-AI (Vision Assistant)

Thank you for your interest in contributing! 🙏

Verid-AI is an assistive web app for blind and visually impaired people.
Voice-first, high contrast, screen-reader accessible, works on phone Chrome (HTTPS only).

> **Safety disclaimer:** This is an assistive tool, NOT a replacement for a cane,
> guide dog, or sighted assistant. Never rely on it for safety-critical decisions.

## Getting Started

### 1. Fork and clone the repository

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/<your-username>/Verid-AI.git
cd Verid-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the env template and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set `GEMINI_API_KEY` or `ANTHROPIC_API_KEY` (only the one
matching your `LLM_PROVIDER`).

> **Never commit `.env.local`** — it is already in `.gitignore`.

### 4. Run the dev server

```bash
npm run dev
# Open http://localhost:3000
```

## Branch Strategy

| Branch  | Owner   | Scope                                |
|---------|---------|--------------------------------------|
| `main`  | shared  | Stable merged code                   |
| `anirudh` | Anirudh | Backend: API routes, server libs, types |
| `ayush`   | Ayush   | Frontend: pages, components, hooks    |

Create your working branch from the branch that matches your change:
- **Backend** (API routes, server libs, types) → branch from `anirudh`
- **Frontend** (pages, components, hooks) → branch from `ayush`
- **Docs / general** → branch from `main` or `anirudh`

## Making Changes

1. Create a branch:

   ```bash
   git checkout anirudh   # or ayush / main
   git checkout -b your-branch-name
   ```

2. Make your changes. Keep accessibility in mind (aria-labels, high contrast, screen-reader friendly).

3. Verify locally before pushing:

   ```bash
   npm run lint
   npm run build
   ```

4. Commit with a clear message:

   ```bash
   git add .
   git commit -m "feat: short description of your change"
   ```

   Use conventional prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`.

5. Push and open a Pull Request:

   ```bash
   git push origin your-branch-name
   ```

   Open a PR against the appropriate branch and describe your change clearly.
   Mention the issue it closes (e.g. `Closes #12`).

## Good First Contributions

- **Frontend:** improve high-contrast mode, add aria-labels, polish mobile UI, add Hindi UI strings
- **Backend:** add input validation with zod, improve rate-limit handling, add tests
- **Docs:** fix typos, translate docs, add screenshots

## Rate Limits

- Per IP: 1 request every 3 seconds
- Global: 20 requests per minute

Exceeded limits return `429 { "error": "busy" }`.

## Code of Conduct

Be respectful to maintainers and other contributors. We are all here to make
this assistive tool better for the people who need it.

---

Welcome to Verid-AI! 🎯
