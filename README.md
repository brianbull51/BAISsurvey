# 🎬 Movie Preferences Survey

## Description

Movie Preferences Survey is an anonymous, browser-based survey application that collects and visualizes movie-watching habits from a group of respondents. Built for BAIS:3300 (Spring 2026), it allows anyone to submit their preferences in under a minute and immediately view aggregated results across the entire respondent pool. The app is designed for classroom data collection — no login required, no personal information stored.

## Badges

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-8A3BDB?style=for-the-badge)

## Features

- **Anonymous submissions** — no account or login required; responses are stored without any personally identifiable information
- **4-question survey** — covers favorite movie (free text), viewing frequency (radio buttons), favorite genre (dropdown), and what matters most in a movie (checkboxes)
- **Real-time results** — the Results page reads live data from Supabase every time it loads, always reflecting the latest submissions
- **Three interactive charts** — vertical bar chart for watch frequency, horizontal bar charts for top preferences and favorite genres, all powered by Recharts
- **Full form validation** — every field is required with clear inline error messages before the form can be submitted
- **Thank-you summary** — after submitting, respondents see a recap of their own answers and a link straight to the results
- **Responsive layout** — works on mobile, tablet, and desktop with a clean, accessible UI
- **Zero friction** — one URL, no install, no sign-up; just open and answer

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI component library |
| TypeScript 5.9 | Static typing across all source files |
| Vite 7 | Development server and production build tool |
| Wouter | Lightweight client-side routing (`/`, `/survey`, `/results`) |
| Tailwind CSS 4 | Utility-first styling with custom purple accent (`#8A3BDB`) |
| Supabase JS v2 | PostgreSQL database client — inserts and reads survey responses |
| Recharts 2 | Composable chart library for the results visualizations |
| pnpm Workspaces | Monorepo package management |

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/en/download) — JavaScript runtime
- [pnpm 9+](https://pnpm.io/installation) — package manager (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project with the `survey_responses` table created (see below)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/movie-survey.git
   cd movie-survey
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set environment variables** — create a `.env` file inside `artifacts/movie-survey/`:
   ```bash
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
   ```

4. **Create the Supabase table** — open the SQL Editor in your Supabase dashboard and run:
   ```sql
   CREATE TABLE IF NOT EXISTS public.survey_responses (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at timestamp with time zone DEFAULT now() NOT NULL,
     favorite_movie text NOT NULL,
     watch_frequency text NOT NULL,
     favorite_genre text NOT NULL,
     preferences text[] NOT NULL
   );

   ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow public insert" ON public.survey_responses
     FOR INSERT WITH CHECK (true);

   CREATE POLICY "Allow public select" ON public.survey_responses
     FOR SELECT USING (true);
   ```

5. **Start the development server**
   ```bash
   pnpm --filter @workspace/movie-survey run dev
   ```

6. **Open the app** — visit `http://localhost:19286` in your browser

## Usage

| Route | Description |
|---|---|
| `/` | Home page — intro and navigation to survey or results |
| `/survey` | Survey form — fill in all 4 questions and submit |
| `/results` | Results page — charts + total response count |

**Configuration options** (via environment variables):

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Full URL of your Supabase project |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for your Supabase project |

To build for production:
```bash
pnpm --filter @workspace/movie-survey run build
```
The output is written to `artifacts/movie-survey/dist/`.

## Project Structure

```
artifacts/movie-survey/
├── public/                        # Static assets served as-is
├── src/
│   ├── App.tsx                    # Root component; defines wouter routes
│   ├── main.tsx                   # React DOM entry point
│   ├── index.css                  # Global Tailwind CSS imports and base styles
│   ├── components/
│   │   ├── Footer.tsx             # "Survey by Brian Bullon, BAIS:3300" footer
│   │   └── ui/                    # Shadcn/Radix UI primitives (button, select, etc.)
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Responsive breakpoint hook
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client initialisation
│   │   ├── types.ts               # Form value interfaces + survey option constants
│   │   └── utils.ts               # Tailwind class merge utility (cn)
│   └── pages/
│       ├── home.tsx               # Landing page with CTA buttons
│       ├── survey.tsx             # 4-question survey form + thank-you screen
│       ├── results.tsx            # Recharts charts + total response count
│       └── not-found.tsx          # 404 fallback page
├── vite.config.ts                 # Vite config (port, path aliases, plugins)
├── tsconfig.json                  # TypeScript project config
└── package.json                   # Package metadata and scripts
```

## Changelog

### v1.0.0 — 2026-03-31

- Initial release
- Home, Survey, and Results pages with client-side routing
- 4-question survey form with full validation and thank-you summary
- Supabase PostgreSQL integration for anonymous response storage
- Three Recharts visualizations: watch frequency, movie preferences, favorite genres
- Responsive Tailwind CSS design with `#8A3BDB` purple accent
- Row-Level Security policies for public insert and select

## Known Issues / To-Do

- [ ] The Results page fetches all rows on every load — should add pagination or a row limit for large datasets
- [ ] No duplicate-submission prevention — the same user can submit the survey multiple times in the same session
- [ ] The "Favorite Movie" free-text field has no normalization, so "The Dark Knight" and "dark knight" appear as separate entries in the raw data
- [ ] Charts do not auto-refresh; the user must reload the Results page to see new submissions
- [ ] No admin view to download or export raw response data as CSV

## Roadmap

- **Word cloud** for the favorite movie free-text field to surface the most commonly mentioned titles
- **Date range filter** on the Results page so instructors can compare responses over time
- **CSV export** button that downloads all raw responses for offline analysis
- **Shareable result links** with a unique URL per survey session for embedding in presentations
- **Multiple survey support** — extend the data model to allow different surveys with different question sets

## Contributing

Contributions are welcome! Please open an issue to discuss any changes before submitting a pull request. Make sure your code passes TypeScript checks (`pnpm run typecheck`) and follows the existing code style before submitting.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main` and describe what you changed and why

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software, provided the original copyright notice and permission notice appear in all copies.

## Author

**Brian Bullon**
University of Iowa — Tippie College of Business
BAIS:3300 Business Analytics & Information Systems — Spring 2026

## Contact

GitHub: [github.com/brianbullon](https://github.com/brianbullon)

## Acknowledgements

- [Supabase Docs](https://supabase.com/docs) — database setup, Row-Level Security, and JavaScript client reference
- [Recharts](https://recharts.org) — composable chart components for React
- [Tailwind CSS](https://tailwindcss.com/docs) — utility-first CSS framework
- [Wouter](https://github.com/molefrog/wouter) — minimalist React router
- [Shadcn/UI](https://ui.shadcn.com) — accessible, unstyled UI primitives
- [Vite](https://vitejs.dev) — fast development and build tooling
- [Replit](https://replit.com) — cloud development and deployment platform
- Claude (Anthropic) — AI assistant used to scaffold, debug, and document this project
