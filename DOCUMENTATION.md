# Kasa UG — Project Documentation

**University of Ghana | Anti-Sexual Harassment Reporting System**

> **Live Project:** [https://cegensa-educate.vercel.app/](https://cegensa-educate.vercel.app/)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [The Landing Page](#3-the-landing-page)
   - 3.1 [Hero Section](#31-hero-section)
   - 3.2 [How It Works](#32-how-it-works)
   - 3.3 [Know Your Rights](#33-know-your-rights)
   - 3.4 [Definitions](#34-definitions)
   - 3.5 [We're Here For You](#35-were-here-for-you)
   - 3.6 [Case Tracking](#36-case-tracking)
4. [The Report Form](#4-the-report-form)
   - 4.1 [Step 1 — Incident Type](#41-step-1--incident-type)
   - 4.2 [Step 2 — What Happened](#42-step-2--what-happened)
   - 4.3 [Step 3 — People Involved](#43-step-3--people-involved)
   - 4.4 [Step 4 — Evidence Vault](#44-step-4--evidence-vault)
   - 4.5 [Step 5 — Rights & Submit](#45-step-5--rights--submit)
   - 4.6 [Submission Confirmation](#46-submission-confirmation)
5. [The Committee Dashboard](#5-the-committee-dashboard)
   - 5.1 [Login](#51-login)
   - 5.2 [Main Dashboard View](#52-main-dashboard-view)
   - 5.3 [Case Detail Page](#53-case-detail-page)
6. [Security Considerations](#6-security-considerations)
7. [Environment Configuration](#7-environment-configuration)
8. [Deployment](#8-deployment)
9. [Conclusion](#9-conclusion)

---

## 1. Project Overview

Kasa UG is a confidential digital reporting platform built for the University of Ghana's Anti-Sexual Harassment Committee (ASHC). The platform enables students, staff, and faculty to report incidents of sexual harassment, assault, and related misconduct in a safe, anonymous, and structured manner — while providing the ASHC with a purpose-built case management dashboard to track, investigate, and resolve complaints within the timelines mandated by UG policy.

The name *Kasa* means "speak" in Akan — a deliberate choice that frames the platform as a space where speaking up is not only possible, but encouraged and protected.

The system has three distinct parts:

| Part | Audience | Purpose |
|---|---|---|
| Public Landing Page | All UG community members | Inform, reassure, and guide users to file a report |
| Report Form | Complainants | Collect a structured, confidential incident report |
| Committee Dashboard | ASHC members only | Manage, investigate, and update case statuses |

---

## 2. System Architecture

Kasa UG is built as a monorepo with three independent sub-projects:

```
/
├── frontend/      — Public-facing site (landing page + report form)
├── dashboard/     — Committee-only case management portal
└── backend/       — REST API serving both frontend and dashboard
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend & Dashboard | React 18, TypeScript, Vite, Tailwind CSS v3 |
| UI Components | Lucide React (icons), Playfair Display + Poppins (typography) |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| ORM | Prisma 5 |
| Database | Neon (serverless PostgreSQL) |
| Authentication | JSON Web Tokens (JWT) + bcryptjs |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

### Data Flow

```
[Complainant]
     │
     ▼
[Public Frontend] ──POST /api/incidents──▶ [Express API] ──▶ [Neon PostgreSQL]
                                                  │
[Committee Member]                                │
     │                                            │
     ▼                                            │
[Dashboard] ──JWT──▶ GET/PATCH /api/incidents ───▶┘
```

The frontend and dashboard are separate Vite applications deployed independently. The backend API serves both, with public endpoints (submit report, track case) and protected endpoints (list/update cases) gated by JWT middleware.

---

## 3. The Landing Page

> 📸 *Screenshot: Full landing page above the fold*

The landing page is the first point of contact between a potential complainant and the system. Every design and copy decision on this page was made with one goal: **to lower the psychological barrier to speaking up**. Survivors of sexual harassment and assault often struggle with shame, fear of retaliation, and a belief that nothing will be done. The page addresses each of these concerns directly and emotionally, before it ever asks anything of the user.

---

### 3.1 Hero Section

> 📸 *Screenshot: Hero section — "You deserve to be heard."*

The hero opens with the line **"You deserve to be heard."** This is deliberate. It does not open with a policy number, a committee name, or an instruction. It opens with an acknowledgement of the person standing in front of it. The sub-headline reinforces this: *"What happened to you is not your fault — and you don't have to carry it alone."*

This framing — extending an olive branch before issuing a call to action — is rooted in trauma-informed design principles. A person who has experienced harassment is not first looking for a form to fill out. They are first looking for a signal that they will be believed. The hero gives them that signal immediately, before asking anything of them.

The two CTAs — **"Tell Us What Happened"** and **"Know Your Rights"** — offer two different entry points depending on where the user is emotionally. Not everyone is ready to report; some users first need to understand what their rights are. Both paths are validated equally.

Floating reassurance bubbles ("Your story is safe with us", "You won't face this alone", "Speaking up cannot hurt you here") drift across the background, reinforcing key messages passively without demanding attention. A trust bar beneath the fold surfaces three non-negotiable guarantees: **Fully Confidential**, **60-Day Investigation Window**, and **Zero Retaliation Policy**.

---

### 3.2 How It Works

> 📸 *Screenshot: "How It Works" / process steps section*

This section demystifies the reporting process by showing it as a clear, numbered sequence of steps — from filing a complaint to the Committee's final decision. Many people hesitate to report because they do not know what happens after they submit. This section removes that uncertainty.

Each step is explained in plain language, without legal jargon. Alongside the steps is a **60-day investigation timeline tracker** that shows the mandatory window within which the university must conclude its investigation per UG policy (§III.iii.g). Making this visible to the public signals institutional accountability — the Committee cannot simply let cases go quiet.

---

### 3.3 Know Your Rights

> 📸 *Screenshot: Rights section*

This section presents the complainant's rights as guaranteed under the University of Ghana's Anti-Sexual Harassment policy. Key rights covered include: the right to remain anonymous, the right to protection from retaliation, the right to confidentiality throughout proceedings, the right to legal counsel during hearings, and the right to appeal any decision.

These rights are not buried in a policy PDF. They are surfaced directly on the page, in accessible language, because a user who knows their rights before they file is a more empowered user. The section is titled **"Your Rights"** — again, using "your" intentionally to personalise the content and signal that these protections belong to the user, not to the institution.

---

### 3.4 Definitions

> 📸 *Screenshot: Definitions / misconduct types card grid*

The definitions section presents each category of prohibited conduct — Sexual Harassment, Quid Pro Quo, Sexual Assault, Sexual Abuse, Sexual Intimidation, Sexual Exploitation, Hostile Environment, and Retaliation — as individual cards.

This serves two purposes. First, it helps a user identify and name what happened to them. Many victims do not report because they are unsure whether their experience "counts" as misconduct. Seeing their experience reflected in a named category validates it. Second, it prepares users for Step 1 of the report form, where they will be asked to select a misconduct type — having read the definitions first, this selection feels less clinical and more informed.

Each card uses a thumbtack icon as a decorative element, echoing the idea of pinning something important — a record, a memory, an account — that deserves to stay visible.

---

### 3.5 We're Here For You

> 📸 *Screenshot: "We're Here For You" / entry points section*

This section presents three parallel entry points with equal visual weight:

- **File a Report** — for users ready to submit a complaint
- **Know the Policy** — for users who want to read the full UG Anti-Sexual Harassment policy first
- **Get Support** — linking to CEGENSA (Centre for Gender Studies and Advocacy), which provides free, confidential counselling independent of the formal reporting process

The inclusion of the CEGENSA link is important: it acknowledges that not every user wants to file a report, and that emotional support is a valid and complete response on its own. The platform does not push everyone towards reporting — it gives people the option to seek support without any strings attached. This is another expression of the "olive branch" philosophy: the platform meets users where they are, not where the process wants them to be.

---

### 3.6 Case Tracking

> 📸 *Screenshot: Track Your Case page*

Available at `/track`, this public page allows a complainant to check the current status of their case using the reference number provided at submission. The user enters their case number and receives a read-only status update showing the current stage of the process (e.g. *Under Investigation*, *Hearing Scheduled*, *Sanctioned*), the date the complaint was filed, and the date it was last updated.

No personally identifiable information about the complainant or respondent is exposed on this page — only the case number, misconduct type, status, and timestamps. A reassurance message is displayed alongside every status result, reminding the user of their confidentiality protections.

The case tracking page is linked from the navigation bar and from the submission confirmation screen, so users always know where to come back to.

---

## 4. The Report Form

> 📸 *Screenshot: Report form — progress bar visible at the top*

The report form (`/report`) collects a structured complaint across five steps. A persistent progress indicator at the top of the form shows the user where they are in the process at all times. A confidentiality notice — *"This report is strictly confidential. Only authorised Committee members have access."* — is pinned above the form on every step.

The form is intentionally paced across multiple steps rather than presented as a single long page. A long-form page can feel overwhelming and impersonal. A stepped form allows the user to focus on one thing at a time, making the process feel more manageable and less clinical.

---

### 4.1 Step 1 — Incident Type

> 📸 *Screenshot: Step 1 — Incident Type selection*

The user selects the category of misconduct from a list of nine options, each accompanied by a plain-English description. The descriptions are written to help users identify their experience, not to test whether they know the legal definition.

If the user selects **Sexual Assault** or **Sexual Abuse**, a contextual alert appears recommending they also report to the Ghana Police Service (191) and preserve any medical evidence. This is not a gatekeeping mechanism — the user can still proceed with the platform report regardless — but it ensures they are aware of parallel legal options for the most severe cases.

---

### 4.2 Step 2 — What Happened

> 📸 *Screenshot: Step 2 — What Happened*

This step collects the narrative core of the complaint: a free-text description of the incident, the date(s) it occurred, the location, how frequently it occurred, and a self-assessed severity rating on a 1–5 scale. A witness field is also presented here.

The description field has a minimum character count (30) to encourage detail, but the tone of the placeholder text is supportive rather than clinical: *"Describe the incident(s) in detail — what was said or done, and how it made you feel."* Including "how it made you feel" acknowledges the emotional dimension of the report alongside the factual one.

---

### 4.3 Step 3 — People Involved

> 📸 *Screenshot: Step 3 — People Involved*

This step collects details about the complainant (optional — users may remain anonymous) and the respondent. The anonymity toggle is surfaced prominently at the top of the complainant section, not hidden in a settings menu. The copy next to the toggle is direct: *"Your identity will not be recorded."*

An optional mediation request is also presented here. Per §III.I.c of UG policy, parties may opt for informal resolution through a mutually agreed mediator before proceeding to formal investigation. A contextual note advises that mediation is not appropriate for severe cases such as assault.

---

### 4.4 Step 4 — Evidence Vault

> 📸 *Screenshot: Step 4 — Evidence Vault*

Users can optionally upload supporting evidence — screenshots, audio/video recordings, written correspondence, medical reports, or witness statements. The upload area supports drag-and-drop. Uploaded files are listed with their filename, size, and a remove option.

Evidence is described as a "vault" throughout the interface to convey the seriousness with which it is treated. A note confirms that files are encrypted and accessible only to authorised Committee members. This step is entirely optional — users who have no evidence to upload are explicitly reassured that proceeding without evidence is valid.

---

### 4.5 Step 5 — Rights & Submit

> 📸 *Screenshot: Step 5 — Rights & Submit, with summary panel*

The final step presents two acknowledgement checkboxes — one confirming the user understands their right to protection from retaliation, and one confirming they understand the confidentiality of proceedings. Both are required before submission.

A read-only summary of the report (type, date, location, anonymity status, file count) is displayed so the user can review what they are about to submit. A policy note warns that deliberately false complaints are subject to disciplinary action under §5.7, reinforcing that the platform is for good-faith reporting.

The submit button is disabled until both acknowledgements are checked, preventing accidental submission.

---

### 4.6 Submission Confirmation

> 📸 *Screenshot: Submission confirmation screen with case reference number*

On successful submission, the form is replaced by a confirmation screen displaying the complainant's unique **Case Reference Number** (format: `UG-SH-YYYY-NNNN`). The user is instructed to save this number to track their case.

A "What Happens Next" section outlines the next steps in the process — Committee review within 5 working days, respondent notification within 7 days, and investigation completion within 60 working days. Two buttons are presented: **Back to Home** and **Track Your Case**, the latter linking directly to the case tracking page with the reference number pre-populated.

---

## 5. The Committee Dashboard

The Committee Dashboard is a separate application (`dashboard/`) accessible only to authorised ASHC members. It is deployed independently from the public frontend and requires authentication. All data displayed is pulled live from the backend API; there is no static or mock data in the production build.

---

### 5.1 Login

> 📸 *Screenshot: Committee login screen*

The login screen is minimal by design — email, password, and a submit button. A password visibility toggle is included. On successful authentication, the backend issues a JWT (8-hour expiry) which is stored in `localStorage` and attached to every subsequent API request via an Axios interceptor. If a request returns a 401 at any point, the token is cleared and the user is redirected to the login screen automatically.

---

### 5.2 Main Dashboard View

> 📸 *Screenshot: Main dashboard — stats cards and case grid*

The main dashboard is the Committee's operational hub. It is divided into three layers:

**Stats bar** — Seven at-a-glance counters covering Active Cases, Overdue, Awaiting Response, New Submissions, Closed, Under Appeal, and Retaliation Flags. Overdue and Retaliation Flag counters are visually distinguished with a red ring to draw immediate attention.

**Alert banners** — If any cases have exceeded the 60-working-day investigation window, a prominent red banner appears with a link to filter to overdue cases only. Similarly, any retaliation reports trigger an amber banner. These are not passive notifications — they are action prompts, because UG policy treats both situations as requiring immediate Committee response.

**Case grid** — All active cases are displayed as cards, each showing the case number, misconduct type, respondent department, status badge, severity indicator (1–5 dots), and the date filed. Cases can be filtered by status, searched by case number, respondent name, or department, and filtered to overdue-only.

A **fixed sidebar** provides persistent navigation, live alert badge counts, and a user chip showing the logged-in Committee member's name and role. A logout button is accessible at the bottom of the sidebar at all times.

---

### 5.3 Case Detail Page

> 📸 *Screenshot: Case detail page — full view*

Clicking any case card opens the full case detail view. This page is the Committee's primary working screen for an individual complaint. It is structured in two columns:

**Main column (left):**
- Full incident description
- Location, date(s), frequency
- Evidence Vault listing all uploaded files with download links
- Recommended sanctions (if any have been recorded), each showing the sanction type, description, and VC approval status
- Audit timeline showing every recorded event in the case's lifecycle (submission, respondent notification, response received, hearing, decision, etc.) in reverse-chronological order

**Sidebar (right):**
- Parties panel showing complainant and respondent details
- Respondent response window tracker, showing notification date, deadline, and whether a response has been received
- Policy reminders surfacing the specific UG policy clauses most relevant to the case (investigation window, response window, confidentiality, retaliation, appeal rights)
- Quick Actions panel for common Committee operations: schedule a hearing, add a note, request a VC extension, recommend sanctions, log a retaliation report, or refer to CEGENSA counselling

A status update button and "Add Note" button are anchored at the top of the page for immediate access.

---

## 6. Security Considerations

- **Authentication** — Committee routes are protected by JWT middleware on every request. Tokens expire after 8 hours. There is no "remember me" — re-authentication is required after expiry.
- **Anonymity** — When a report is filed anonymously, the complainant's name and email fields are explicitly set to `null` in the database. There is no hidden identifier linking the submission to a person.
- **Public API** — The public incident submission endpoint and the case tracking endpoint return only the minimum data necessary. The tracking endpoint returns case number, status, misconduct type, and timestamps only — no complainant or respondent details.
- **CORS** — The API restricts cross-origin requests to explicitly whitelisted origins (frontend and dashboard URLs) configured via environment variable.
- **Passwords** — Committee member passwords are hashed with bcryptjs (cost factor 10) before storage. Plain-text passwords are never persisted.
- **Environment variables** — Secrets (`DATABASE_URL`, `JWT_SECRET`) are never committed to the repository. The `.gitignore` excludes all `.env` files across all sub-projects.

---

## 7. Environment Configuration

Each sub-project requires its own `.env` file (not committed to version control).

### `backend/.env`

```env
DATABASE_URL=postgresql://...       # Neon connection string
JWT_SECRET=...                      # Long random string (min 32 chars)
JWT_EXPIRES_IN=8h
PORT=4000
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-dashboard.vercel.app
```

### `frontend/.env`

```env
VITE_API_URL=https://your-backend.onrender.com
```

### `dashboard/.env`

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 8. Deployment

| Sub-project | Platform | Notes |
|---|---|---|
| `frontend/` | Vercel | Root directory: `frontend`, build command: `npm run build`, output: `dist` |
| `dashboard/` | Vercel | Root directory: `dashboard`, same build config |
| `backend/` | Render | Root directory: `backend`, build: `npm install && npx prisma generate && npm run build`, start: `npm start` |

The database (Neon) is a managed serverless PostgreSQL instance and requires no deployment configuration beyond the connection string.

**First deploy checklist:**
- [ ] Push schema to Neon: `npx prisma db push`
- [ ] Seed the database: `npx tsx src/seed.ts`
- [ ] Set all environment variables in Render and Vercel dashboards
- [ ] Update `CORS_ORIGINS` on the backend with the live Vercel URLs
- [ ] Update `VITE_API_URL` on both frontend and dashboard with the live Render URL

---

## 9. Conclusion

Kasa UG is built around a single conviction: that the technology used to report sexual harassment should not add to the burden of the person reporting it. Every decision — from the words in the hero section to the structure of the five-step form, from the anonymity toggle to the 60-day tracker on the dashboard — was made in service of that conviction.

For complainants, the platform provides a clear, dignified, and genuinely confidential path to speaking up. For the Anti-Sexual Harassment Committee, it provides a structured, accountable, and policy-aligned tool for managing cases from first report to final resolution.

The system is live, fully connected to a production database, and ready for use.

> **Live Project:** [https://cegensa-educate.vercel.app/](https://cegensa-educate.vercel.app/)

---

*Documentation prepared for the University of Ghana Anti-Sexual Harassment Committee — Kasa UG v0.1.0*
