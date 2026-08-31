# NextStep

NextStep is a simple job application command center. It helps job seekers keep applications, status updates, follow-up dates, job links, and notes in one place instead of managing everything in a spreadsheet.

[View the live demo](https://mykeram.github.io/nextstep/)

## Current features

- Add job applications with company, role, location, job URL, status, applied date, follow-up date, and notes
- Edit or delete applications
- Open an application detail view with full notes, job link, important dates, and a status timeline
- Update an application's status directly from the list or board
- Receive a fixed success confirmation after applications are added, edited, moved to a new status, or removed
- Search applications by company, role, or location
- Filter applications by status
- Sort applications by follow-up date, applied date, or company
- View a live count for every application stage
- Switch between list and responsive board views without horizontal scrolling
- See upcoming follow-ups in date order, with overdue items highlighted
- Switch between a follow-up list and month calendar view
- Receive in-app reminders for overdue and due-today follow-ups
- Prioritize follow-ups as overdue, due today, or upcoming, then complete or snooze them for 1, 3, or 7 days
- Track pipeline health, response rate, monthly submissions, offers, and next actions with dashboard insights
- Save data in the browser with `localStorage`
- Sign in with a passwordless email magic link
- Sync signed-in users' applications securely to Supabase
- Start from a minimal landing page and open the dashboard after secure sign-in
- Use a staged dashboard entrance with an account-status typing effect, cloud-sync shine, and sequential status cards
- Respect reduced-motion preferences so the dashboard remains immediately accessible
- Link to the developer portfolio from the footer
- Includes eight realistic demo applications across every status, with a one-time migration for earlier demo data

## Tech stack

- React
- TypeScript
- Vite
- Plain CSS
- Supabase Auth and Postgres
- Vitest and React Testing Library
- GitHub Pages

## Dashboard motion

The signed-in dashboard introduces information in a deliberate order: the header enters first, the workspace sections follow, the signed-in account panel types the email address and reveals cloud-sync confirmation, and the five application-status cards arrive individually from left to right.

The motion uses CSS only and honors `prefers-reduced-motion`, which shows all content immediately without animated movement, typing, or shine effects.

## Application change feedback

After an application is added, edited, moved to a new status, or removed, NextStep shows a brief fixed green confirmation bar. It slides in from the top, remains visible long enough to be read, then uses a matching upward exit animation.

## Follow-up workflow

The Follow-ups list and urgent reminder banner give users three immediate actions: edit an application, mark its follow-up as complete, or snooze it for 1, 3, or 7 days. Completing clears the follow-up date; snoozing schedules a new date from today. Each action updates the signed-in user's existing cloud-synced application record and confirms the result in the app.

## Project structure

```text
src/
├── components/  # Reusable UI sections, grouped by component
├── data/        # Demo application data and form defaults
├── hooks/        # Reusable React hooks, including authentication
├── lib/          # Third-party client configuration
├── services/     # Supabase application data operations
├── test/         # Shared test setup and application fixtures
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

Visitors start on a minimal landing page. Enter an email address to receive a one-time magic link. Supabase creates an account automatically for a new email address, then returns the user to the protected NextStep dashboard with an active session.

While signed in, NextStep loads that user's saved applications from Supabase. On a first sign-in, it seeds a personal copy of the demo applications into the user's cloud account. Later adds, edits, status changes, and deletions are synced to the cloud. Status changes are retained in each application's timeline. Signing out returns the visitor to the landing page.

The hosted project is configured with a Supabase database migration, row-level security, GitHub Actions variables, and the production redirect URL. For local development, copy `.env.example` to `.env.local` and add the project's URL and publishable key.

The publishable key is safe for browser use because the `applications` table is protected by row-level security; never add a Supabase secret or service-role key to the frontend or repository variables.

Useful commands:

```bash
npm run format
npm run format:check
npm run test
npm run test:watch
npm run build
```

The GitHub Pages workflow runs the automated test suite before each production build and deployment.

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
- [x] Add dashboard insights for pipeline health and next actions
- [x] Add a detailed application modal with a persisted status timeline
- [x] Add animated confirmation feedback for application changes
- [x] Add automated component and utility tests with Vitest and React Testing Library
- [x] Add cloud-synced follow-up completion, snoozing, and priority labels

### Next steps

- [ ] Add scheduled email or push follow-up reminders

## Project status

This is an active portfolio project. The MVP now covers a complete authenticated, cloud-synced application-tracking workflow, with scheduled reminders planned next.
