# Rahmat Ichwan Bahtiar Website

## Purpose
**Personal Public Information & Accountability Platform** for Rahmat Ichwan Bahtiar.  
Built under the core principle: **Flexible Content, Fixed System** (Developer controls the application architecture; Admin manages content via CMS; Website displays the data).

---

## Technology Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Backend Services:** [Supabase](https://supabase.com/) & [PostgreSQL](https://www.postgresql.org/)
- **Deployment Target:** [Vercel](https://vercel.com/)
- **Version Control:** [Git](https://git-scm.com/) & [GitHub](https://github.com/)

---

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env.local
```
Fill in the values in `.env.local` according to your local or Supabase development project.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 4. Run Validation
```bash
# Type checking
npm run typecheck

# Linting
npm run lint
```

### 5. Build Project
```bash
npm run build
```

---

## Environment Variables

| Variable Name | Environment | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Public / Client | Base application URL (default: `http://localhost:3000`). |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Supabase Project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Supabase Anonymous Public API key (client-safe). |
| `SUPABASE_SERVICE_ROLE_KEY` | Private / Server Only | Supabase Service Role Key with administrative privileges (never exposed to client). |

---

## Project Architecture

```text
src/
├── app/                    # Next.js App Router routes, layouts, and error boundaries
│   ├── (public)/           # Public-facing page route placeholders
│   ├── admin/              # Future Admin CMS route placeholder
│   ├── error.tsx           # Route segment error boundary
│   ├── global-error.tsx    # Root layout error boundary
│   ├── layout.tsx          # Root HTML/Body layout shell
│   ├── not-found.tsx       # Custom 404 handler
│   └── page.tsx            # Foundation verification homepage
├── components/
│   ├── ui/                 # Reusable primitive UI components
│   └── layout/             # Shared layout shell components
├── lib/
│   ├── env.ts              # Safe environment variable getter and validator
│   ├── utils.ts            # Common utility functions (e.g. cn)
│   └── supabase/           # Supabase SSR client factories (browser, server, middleware)
├── services/               # Future domain data services interfacing with Supabase
└── types/
    ├── index.ts            # Common domain and application types
    └── database.ts         # Database entity schema blueprint (site_settings, articles, etc.)
```
