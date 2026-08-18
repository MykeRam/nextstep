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

## Run locally

```bash
npm install
npm run dev
```

Vite automatically opens the app in your default browser. To stop the server, press `Ctrl+C` in the terminal.

Useful commands:

```bash
npm run format
npm run format:check
npm run build
```

## Planned next steps

- Add user accounts and cloud-based storage with Supabase
- Add a calendar view and scheduled follow-up reminders
- Add dashboard insights
- Add résumé and job-description matching

## Project status

This is an early MVP built as a portfolio project. The current version focuses on a clean, usable application-tracking workflow before adding more advanced features.
