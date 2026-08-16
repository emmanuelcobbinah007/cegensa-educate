# Cegensa Educate

A full-stack web application enabling confidential, anonymous harassment reporting and case management for the University of Ghana community.

Live Demo: https://cegensa-educate.vercel.app

---

## Overview

Sexual harassment is a pervasive issue in academic institutions. Cegensa Educate provides a safe, confidential platform for students and staff to report incidents of sexual misconduct while maintaining anonymity and protecting their rights throughout the investigation process.

This project demonstrates a production-ready full-stack application with three distinct user interfaces:
- Public Portal — Anonymous incident reporting
- Public Tracker — Case status tracking for complainants
- Committee Dashboard — Secure case management for authorized members

---

## Key Features

### Public Reporting Portal
- Anonymous Submissions — Report without revealing identity
- Multi-Step Form — Guided incident categorization with 9 misconduct types
- Rich Context — Incident location, date range, frequency, and witness details
- Privacy Controls — Explicitly acknowledge rights and confidentiality terms
- Case Tracking — Receive confirmation code for case status updates
- Severity Assessment — Self-reported severity level (1–5 scale)

### Public Tracker
- Status Updates — Real-time case progress through 15+ workflow states
- Case Lookup — Confidential access using case number only
- Transparent Timeline — Clear status descriptions and next steps:
  - Submitted → Intake Review → Investigation → Hearing → Resolution
- Privacy — No personally identifiable information displayed

### Committee Dashboard (Protected)
- Secure Authentication — JWT-based login with password hashing
- Case Management — List, search, filter, and paginate incidents
- Role-Based Access — Member, Secretary, and Chair roles
- Incident Details — Full case history including complainant/respondent info
- Status Workflow — Managed progression through investigation states
- Case Tracking — View all updates in real-time

---

## Architecture

This is a three-tier full-stack application:

```
┌─────────────────────────────────────────────────────────────┐
│  Client Layer (React + Vite)                               │
├──────────────────┬──────────────────┬──────────────────────┤
│  Frontend        │  Dashboard       │  Public Portal       │
│  (Port 3000)     │  (Port 3001)     │  (Main Site)         │
└──────────────────┴──────────────────┴──────────────────────┘
                          ↓ HTTP REST
┌─────────────────────────────────────────────────────────────┐
│  API Layer (Express.js + TypeScript)                       │
│  ├─ /api/auth       (JWT Login)                            │
│  ├─ /api/incidents  (Report Submission & Management)       │
│  └─ /health        (Health Check)                         │
│  Port: 4000                                                │
└─────────────────────────────────────────────────────────────┘
                          ↓ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│  Data Layer (PostgreSQL + Prisma ORM)                      │
│  ├─ CommitteeMember (Auth)                                 │
│  └─ Incident (Cases)                                       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18, TypeScript, Vite (fast bundler)
- React Router for multi-page navigation
- Axios for API calls
- TailwindCSS for styling
- Lucide Icons for UI components

**Backend:**
- Express.js, TypeScript
- JWT authentication with Bcryptjs
- Prisma ORM for type-safe database access
- CORS-configured for multi-origin frontend access

**Database:**
- PostgreSQL (Neon cloud-hosted)
- Prisma migrations for schema management

**Deployment:**
- Vercel (frontend + backend)
- Neon PostgreSQL (serverless database)

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL database (local or cloud: Neon recommended)
- Git

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/emmanuelcobbinah007/cegensa-educate.git
cd cegensa-educate
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with database credentials
cat > .env << EOF
DATABASE_URL="postgresql://user:password@host:5432/cegensa?sslmode=require"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="8h"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
PORT=4000
EOF

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed sample data (optional)
npm run db:seed

# Start backend
npm run dev
# Runs on http://localhost:4000
```

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:4000
EOF

# Start dev server
npm run dev
# Runs on http://localhost:3000
```

#### 4. Setup Dashboard (Optional)

```bash
cd ../dashboard

# Install dependencies
npm install

# Create .env file (same as frontend)
cat > .env << EOF
VITE_API_URL=http://localhost:4000
EOF

# Start dev server
npm run dev
# Runs on http://localhost:3001
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/login              Login with email & password
POST   /api/auth/logout             Logout (no-op, client drops token)
```

### Incidents (Public)
```
POST   /api/incidents               Submit new incident report
GET    /api/incidents/track/:caseNo Public case status lookup
```

### Incidents (Protected - Requires JWT)
```
GET    /api/incidents               List all incidents (paginated, filterable)
GET    /api/incidents/:id           Get incident details
PATCH  /api/incidents/:id/status    Update incident status
```

### Health
```
GET    /health                      Service health check
```

#### Example: Submit an Incident
```bash
curl -X POST http://localhost:4000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "misconduct_type": "sexual_harassment",
    "severity": 4,
    "incident_description": "...",
    "incident_location": "...",
    "incident_date_from": "2026-01-15",
    "is_anonymous": true,
    "rights_acknowledged": true,
    "confidentiality_acknowledged": true
  }'
```

Response (201 Created):
```json
{
  "id": "cuid123...",
  "caseNumber": "UG-SH-2026-0042",
  "status": "submitted",
  "createdAt": "2026-01-20T14:32:00Z"
}
```

---

## Database Schema

### CommitteeMember (Authentication)
```prisma
model CommitteeMember {
  id           String    @id
  email        String    @unique
  passwordHash String
  fullName     String
  role         String    // "member" | "chair" | "secretary"
  department   String?
  isActive     Boolean
  lastLogin    DateTime?
  createdAt    DateTime
  updatedAt    DateTime
}
```

### Incident (Case Reports)
```prisma
model Incident {
  id                      String   @id
  caseNumber              String   @unique  // e.g., UG-SH-2026-0001
  status                  String             // submitted, intake_review, under_investigation, etc.
  misconductType          String             // 9 types: sexual_harassment, quid_pro_quo, etc.
  severity                Int      (1–5)
  
  // Complainant Info
  isAnonymous             Boolean
  complainantName         String?
  complainantEmail        String?
  complainantAffiliation  String?
  
  // Respondent Info
  respondentName          String?
  respondentDepartment    String?
  respondentAffiliation   String?
  
  // Incident Details
  incidentDescription     String
  incidentLocation        String?
  incidentDateFrom        String?
  incidentDateTo          String?
  incidentFrequency       String   // single_incident, repeated, ongoing
  
  // Additional Context
  hasWitnesses            Boolean
  witnessNames            String?
  mediationRequested      Boolean
  
  // Acknowledgements
  rightsAcknowledged      Boolean
  confidentialityAcknowledged Boolean
  
  createdAt               DateTime
  updatedAt               DateTime
}
```

---

## Security & Privacy

Authentication
- JWT tokens with configurable expiry
- Bcryptjs password hashing (salt rounds: 10)
- Secure credential validation on every request

Data Protection
- Anonymous reporting option (no identity required)
- Confidentiality acknowledgement on submission
- Committee-only access to sensitive case data
- Role-based access control (Member/Chair/Secretary)

API Security
- CORS configured for trusted origins only
- JWT middleware on protected routes
- Input validation on all endpoints
- Consistent error messages (no info leakage)

Database
- PostgreSQL with SSL/TLS support
- Prisma prevents SQL injection via parameterized queries
- Environment variables for secrets (never in code)

---

## Case Workflow States

```
submitted
    ↓
intake_review
    ├→ mediation_offered
    │    ├→ mediation_active
    │    ├→ mediation_failed → respondent_notified
    │    └→ mediation_successful → closed_resolved
    └→ respondent_notified
         ↓
      awaiting_response
         ↓
      response_received
         ↓
      under_investigation
         ↓
      hearing_scheduled
         ↓
      hearing_complete
         ↓
      adjudication_complete
         ├→ sanctioned → closed_with_sanctions
         └→ not_upheld → closed_dismissed
```

---

## UI/UX Highlights

### Frontend Design
- Custom Color Palette: Ocean, Terra, Sand theme for accessibility
- Responsive Layout: Mobile-first design (works on all devices)
- Animation & Feedback: Scroll-reveal effects, loading states, error handling
- Form Validation: Real-time feedback with clear error messages
- Accessibility: Semantic HTML, ARIA labels, keyboard navigation

### Component Highlights
- Multi-step form wizard with progress tracking
- Status timeline with icons and descriptions
- Case listing with search, filter, and pagination
- Secure login with password visibility toggle
- Modal dialogs for confirmations

---

## Project Structure

```
cegensa-educate/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Express app setup
│   │   ├── routes/
│   │   │   ├── auth.ts        # Login/logout endpoints
│   │   │   └── incidents.ts   # Incident CRUD & tracking
│   │   ├── lib/
│   │   │   ├── prisma.ts      # Prisma client singleton
│   │   │   └── middleware.ts  # Auth middleware (requireAuth)
│   │   └── seed.ts            # Database seeding script
│   ├── prisma/
│   │   └── schema.prisma      # Prisma data model
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Router setup
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Landing & feature overview
│   │   │   ├── ReportForm.tsx # Multi-step incident form
│   │   │   └── TrackCase.tsx  # Case status tracker
│   │   ├── components/
│   │   │   └── Navbar.tsx     # Navigation component
│   │   ├── lib/
│   │   │   └── api.ts         # Axios instance
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript interfaces
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
├── dashboard/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx      # Committee login
│   │   │   ├── Dashboard.tsx  # Case management
│   │   │   └── CaseDetail.tsx # Single case view
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Testing

### Manual Testing
```bash
# 1. Backend is running on port 4000
# 2. Frontend running on port 3000
# 3. Test public report submission:
curl http://localhost:3000/report

# 4. Track a case (use caseNumber from response)
curl http://localhost:3000/track?case=UG-SH-2026-0001

# 5. Login to dashboard (default: committee@ug.edu.gh / committee2026)
curl http://localhost:3001/login
```

### Automated Testing (Future)
```bash
# Backend tests
cd backend
npm run test

# Frontend tests (Vitest + React Testing Library)
cd frontend
npm run test
```

---

## Deployment

### Deploy Backend (Vercel)
```bash
cd backend
vercel deploy
```

### Deploy Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Environment Variables (Production)
Set these on your hosting platform:
- DATABASE_URL — PostgreSQL connection string (Neon)
- JWT_SECRET — Cryptographically secure random string (min. 32 chars)
- JWT_EXPIRES_IN — Token expiry (e.g., "8h")
- CORS_ORIGINS — Comma-separated allowed origins
- PORT — Port for backend (default: 4000)
- VITE_API_URL — Backend API URL for frontend

---

## Learning Highlights

This project demonstrates proficiency in:

**Frontend Development**
- React hooks (useState, useRef, useEffect, custom hooks)
- React Router for multi-page SPAs
- Form handling & validation in React
- TypeScript for type safety
- TailwindCSS utility-first styling
- Responsive & accessible UI design
- Axios for API integration

**Backend Development**
- Express.js API design & routing
- JWT authentication & authorization
- Middleware (CORS, auth guards)
- Error handling & validation
- Type safety with TypeScript
- RESTful API conventions

**Database & ORM**
- Prisma schema modeling
- Relational data design
- Database migrations
- Seed data scripts
- Type-safe queries (no SQL injection)

**DevOps & Deployment**
- Environment configuration
- Git version control
- Vercel serverless deployment
- PostgreSQL cloud hosting

**Software Engineering Practices**
- Clean code structure & organization
- Consistent naming conventions
- Error handling and logging
- API documentation
- README documentation

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## Author

Emmanuel Cobbinah
GitHub: @emmanuelcobbinah007

---

## Acknowledgments

- University of Ghana Anti-Sexual Harassment Committee for policy guidance
- MLH Fellowship for mentorship and community
- Open-source community for incredible tools (React, Express, Prisma, TailwindCSS)

---

## Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Email: emmanuelcobbinah707@gmail.com
- Connect on LinkedIn: https://linkedin.com/in/emmanuelcobbinah

---

## Live Demo

Frontend: https://cegensa-educate.vercel.app

Try reporting an incident or tracking a case using the case numbers seeded in the database (e.g., UG-SH-2026-0001).
