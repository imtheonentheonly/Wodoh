# وضُـوح (Wodoh) — AI-Powered Operations Intelligence Platform

Hackathon prototype built for **Bank Alinma**. This is an internal Operations-Department tool for detecting duplicate payments, reconciliation issues, and AML/TF alerts, paired with a fictional customer mobile-banking simulation used to trigger a live end-to-end incident.

**This is a prototype for demonstration purposes only. It is not a production banking system, and no real customer, account, or transaction data is used anywhere in the app.**

## Branding

Place your bank logo file at `public/Alinma-Bank-Symbol.png`. It's referenced by
absolute path (`/Alinma-Bank-Symbol.png`) from four places, so dropping a new
file there updates all of them at once:
- `src/pages/Login.tsx` (employee login)
- `src/pages/Splash.tsx` (boot screen)
- `src/components/layout/Sidebar.tsx` (desktop nav header)
- `src/components/layout/MobileNav.tsx` (mobile drawer header)
- `src/pages/customer/CustomerLogin.tsx` (customer PIN login)

## Getting started

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`, starting on the splash screen.

## Demo flow

1. From the splash screen, land on the employee **Login** page for the Operations Dashboard, or tap **"محاكاة تطبيق العميل"** to enter the customer mobile app.
2. In the customer app, log in with PIN **1234** (pre-filled as Mohammed Hamad).
3. Go to **Transfer**, send **SAR 100,000** to **Ahmed Fahad** (the default recipient) — this is the scripted incident scenario.
4. Confirm the transfer. The core banking system "duplicates" it to **SAR 200,000**.
5. Switch back to the Operations Dashboard (`/`) — a critical AI-detected case appears live: banner, notification badge, new case in **Cases**, entry in **AI Dashboard**, and a flagged transaction in **Transaction Monitoring**.
6. Open the case to see the full AI investigation workspace — confidence factors, timeline, freeze/assign/escalate/resolve actions, and PDF/CSV export.

## Tech stack

React + Vite + TypeScript + Tailwind CSS + React Router + Framer Motion + Zustand + Recharts + Lucide Icons.

## Structure

- `src/pages/` — Operations Dashboard pages (Dashboard, AI Dashboard, Transactions, Cases, AML, TF, Reports, Audit Trail, Employees, Roles, Settings, Profile, Help)
- `src/pages/customer/` — Customer mobile banking simulation
- `src/store/` — Zustand stores (`opsStore`, `customerStore`) — cross-wired so the customer transfer simulation pushes live state into the ops dashboard
- `src/components/` — shared UI, layout, and chart components
- `src/data/mockData.ts` — all fictional seed data
