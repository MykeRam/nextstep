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
- Switch between a follow-up list and month calendar view
- Receive in-app reminders for overdue and due-today follow-ups
- Save data in the browser with `localStorage`
- Sign in with a passwordless email magic link
- Sync signed-in users' applications securely to Supabase
- Link to the developer portfolio from the footer
- Includes eight realistic demo applications across every status, with a one-time migration for earlier demo data

## Tech stack

- React
- TypeScript
- Vite
- Plain CSS
- Supabase Auth and Postgres
- GitHub Pages

## Project structure

```text
src/
├── components/  # Reusable UI sections, grouped by component
├── data/        # Demo application data and form defaults
├── hooks/        # Reusable React hooks, including authentication
├── lib/          # Third-party client configuration
├── services/     # Supabase application data operations
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

## Sign-in and cloud sync

NextStep uses Supabase for passwordless email authentication and cloud storage.

Enter an email address in the app to receive a one-time magic link. Supabase creates an account automatically for a new email address, then returns the user to NextStep with an active session.

While signed in, NextStep loads that user's saved applications from Supabase. On a first sign-in, it copies the current browser applications to the user's cloud account. Later adds, edits, status changes, and deletions are synced to the cloud. Signed-out use remains local to the browser with `localStorage`.

The hosted project is configured with a Supabase database migration, row-level security, GitHub Actions variables, and the production redirect URL. For local development, copy `.env.example` to `.env.local` and add the project's URL and publishable key.

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
- [x] Add passwordless sign-in and secure cloud-based storage with Supabase
- [x] Add a follow-up calendar and in-app overdue/due-today reminders

### Next steps

- [ ] Add scheduled email or push follow-up reminders
- [ ] Add dashboard insights
- [ ] Add an AI Job Fit Analyzer with a secure server-side OpenAI integration
  - Compare a saved résumé against each job description
  - Return a match score, matching skills, and skill gaps
  - Suggest résumé improvements and draft tailored cover letters

## Project status

This is an active portfolio project. The MVP now covers a complete local and cloud-synced application-tracking workflow, with scheduled reminders, insights, and AI guidance planned next.
