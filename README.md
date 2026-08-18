# NextStep

NextStep is a simple job application command center. It helps job seekers keep applications, status updates, follow-up dates, job links, and notes in one place instead of managing everything in a spreadsheet.

## Current features

- Add job applications with company, role, location, job URL, status, applied date, follow-up date, and notes
- Edit or delete applications
- Update an application's status directly from the list or board
- Search applications by company, role, or location
- Filter applications by status
- Sort applications by follow-up date, applied date, or company
- View a live count for every application stage
- Switch between list and responsive board views without horizontal scrolling
- See upcoming follow-ups in date order, with overdue items highlighted
- Save data in the browser with `localStorage`
- Includes eight realistic demo applications across every status, with a one-time migration for earlier demo data

## Tech stack

- React
- TypeScript
- Vite
- Plain CSS

## Project structure

```text
src/
├── components/  # Reusable UI sections, grouped by component
├── data/        # Demo application data and form defaults
├── types/       # Shared TypeScript types
├── utils/       # Storage and date-formatting helpers
├── App.tsx      # Application state and component composition
└── styles.css   # Shared application styles
```

## Run locally

```bash
npm install
npm run dev
```

Vite automatically opens the app in your default browser. To stop the server, press `Ctrl+C` in the terminal.

## Cloud sync setup

NextStep includes the Supabase client, an email sign-in flow, and a secure applications migration. To enable cloud sync:

1. Create a Supabase project and run the SQL file in `supabase/migrations/` through the Supabase SQL Editor.
2. Copy `.env.example` to `.env.local`, then add the project's URL and publishable key.
3. In Supabase Auth settings, add `http://localhost:5173` and `https://mykeram.github.io/nextstep/` as redirect URLs.
4. In this GitHub repository's Actions variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` so the deployed build can connect.

The publishable key is safe for browser use because the `applications` table is protected by row-level security; never add a Supabase secret or service-role key to the frontend or repository variables.

Useful commands:

```bash
npm run format
npm run format:check
npm run build
```

## Product roadmap

### Completed

- [x] Set up the React, TypeScript, and Vite application
- [x] Add, edit, delete, and persist job applications in the browser
- [x] Add job links, follow-up dates, notes, and status updates
- [x] Build search, status filters, sorting, and live stage counts
- [x] Add list and responsive board views
- [x] Surface upcoming follow-ups and overdue items
- [x] Add realistic demo data across every application stage
- [x] Add Prettier formatting and production-build checks

### Next steps

- [ ] Add user accounts and cloud-based storage with Supabase
- [ ] Add a calendar view and scheduled follow-up reminders
- [ ] Add dashboard insights
- [ ] Add an AI Job Fit Analyzer with a secure server-side OpenAI integration
  - Compare a saved résumé against each job description
  - Return a match score, matching skills, and skill gaps
  - Suggest résumé improvements and draft tailored cover letters

## Project status

This is an active portfolio project. The MVP now covers a complete local application-tracking workflow, with AI guidance, cloud sync, reminders, and insights planned next.
