# Lead Manager — Full Stack Screening Assignment

> **Candidate:** Manav Mittal  
> **Role:** Full Stack Developer Screening Assignment  
> **Company:** Meru Technosoft Pvt. Ltd.  

---

## 1. Overview

**Lead Manager** is a full-stack web application designed for sales representatives to capture, qualify, update, and track prospective sales leads across the pipeline.

The application is built with a focus on clean architectural separation, robust error handling, responsive UI/UX, and zero-configuration local execution with an embedded SQLite database.

---

## 2. Tech Stack & Architectural Decisions

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons | Instant HMR development, clean component hierarchy, accessible modern design, responsive table & modal views, and zero-friction UI state management. |
| **Backend** | Node.js, Express.js | Industry-standard, lightweight, performant RESTful API layer with dedicated routing, middleware, controllers, and input validators. |
| **Database** | SQLite (`node:sqlite`) | Embedded, serverless, self-contained SQL database with zero external installation or Docker requirements for reviewers. Supports foreign keys, WAL mode, and indexes for fast queries. |
| **Testing** | Node.js Test Runner (`node:test`), Supertest | Built-in test runner for rapid execution, with end-to-end integration tests covering all REST endpoints, validation errors, and authentication flows. |
| **Auth (Bonus)** | JWT (`jsonwebtoken`), `bcryptjs` | Secure password hashing, token expiration, and user-scoped leads isolation, complete with a 1-click **Demo Login** for instant evaluation. |

---

## 3. Features Implemented

### Required Core Features
- [x] **Add a Lead**: Capture lead with `name`, `email`, `phone`, `company`, `source` (dropdown), and `status` (`New`, `Contacted`, `Qualified`, `Lost`), plus optional remarks.
- [x] **List Leads**: Clean tabular overview with color-coded status badges, formatted timestamps, and clear contact links (`mailto:`, `tel:`).
- [x] **Edit a Lead**: Pre-filled modal form allowing real-time edits to lead contact details and pipeline status.
- [x] **Delete a Lead (with Confirmation Step)**: Accessible confirmation dialog preventing accidental deletions.
- [x] **Search & Filter**: Real-time debounced search by name, email, or company, combined with status filter tabs and source filter dropdowns.
- [x] **Frontend & Backend Validation**:
  - Full name (required, min 2 chars, max 100 chars)
  - Email (required, regex-validated format)
  - Phone (optional, regex-validated international format)
  - Company (optional, max 100 chars)
  - Source enum check (`Website`, `Referral`, `Cold Outreach`, `Social Media`, `Event`, `Other`)
  - Status enum check (`New`, `Contacted`, `Qualified`, `Lost`)
  - Detailed 400 Bad Request responses with field-specific error messages.

### Bonus Features Implemented
- [x] **Small Dashboard Counters**: Status summary cards showing total leads and counts for *New*, *Contacted*, *Qualified*, and *Lost*. Clicking any card filters the table instantly.
- [x] **Pagination & Sorting**: Configurable page limits (5, 10, 25, 50), page navigation (Previous/Next/Page indicators), and sortable columns (Name, Company, Status, Created Date) in ASC/DESC order.
- [x] **Simple Authentication & Multi-User Isolation**: User signup and login with hashed passwords and JWT tokens. Each authenticated user's leads are securely scoped. Includes a 1-click **Demo Login** button so evaluators can inspect the dashboard immediately without typing credentials.
- [x] **Automated API Test Suite**: 22 automated integration tests running with `npm test`, testing validation logic, CRUD endpoints, error states, and auth flows.
- [x] **Single-Port Production Serving**: In production mode (`npm start`), the Express server serves both the REST API endpoints and the built React frontend bundle from a single port (`http://localhost:5000`).

---

## 4. Project Structure

```text
CompanyAssignment/
├── client/                     # Frontend React + Vite application
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AuthModal.jsx           # Sign in, Sign up & 1-click Demo modal
│   │   │   ├── DeleteConfirmModal.jsx  # Accessible deletion confirmation dialog
│   │   │   ├── LeadModal.jsx           # Create & Edit lead modal with validation
│   │   │   ├── LeadsFilter.jsx         # Search bar, status tabs, source dropdown
│   │   │   ├── LeadsTable.jsx          # Table with sorting & pagination
│   │   │   ├── Navbar.jsx              # Navigation header with profile status
│   │   │   ├── StatsCards.jsx          # Pipeline counter summary cards
│   │   │   ├── StatusBadge.jsx         # Color-coded status badges
│   │   │   └── Toast.jsx               # Feedback notifications banner
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # React Authentication Context & Provider
│   │   ├── services/
│   │   │   └── api.js                  # Centralized fetch client with auth headers
│   │   ├── App.jsx                     # Main application layout & state coordinator
│   │   ├── index.css                   # Tailwind CSS imports & styles
│   │   └── main.jsx                    # React entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                  # Vite bundler config with /api proxy
│
├── server/                     # Backend Node.js + Express REST API
│   ├── data/                   # SQLite database directory (auto-created)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # SQLite connection, schema, indexes, seed data
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, demo-login, me
│   │   │   └── leadController.js       # CRUD, filtering, pagination, stats
│   │   ├── middleware/
│   │   │   ├── auth.js                 # JWT verification (requireAuth & optionalAuth)
│   │   │   ├── errorHandler.js         # 404 & centralized error handler
│   │   │   └── validateLead.js         # Input validation & sanitization
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # /api/auth routes
│   │   │   └── leadRoutes.js           # /api/leads routes
│   │   ├── tests/                      # Automated test suite (22 tests)
│   │   │   ├── auth.test.js            # Auth registration & login tests
│   │   │   ├── delivery.test.js        # Full-stack static asset delivery tests
│   │   │   └── leads.test.js           # Leads CRUD, search, filter, validation tests
│   │   ├── app.js                      # Express application setup
│   │   └── server.js                   # Server entrypoint (listening on port 5000)
│   ├── .env.example
│   └── package.json
│
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore rules for node_modules, .env, *.sqlite
├── package.json                # Root package with concurrent dev scripts
└── README.md                   # Project documentation
```

---

## 5. How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ or v22/v24 recommended)
- **npm**: v9.0.0 or later

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd CompanyAssignment
```

### Step 2: Install Dependencies
Run the install command from the root directory:
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### Step 3: Run in Development Mode
You can start both the backend server and frontend development server simultaneously with a single command from the root:
```bash
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)  
- **Backend API:** [http://localhost:5000](http://localhost:5000)  
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)  

*(Note: The database and sample leads are seeded automatically on first start into `server/data/leads.sqlite` with zero manual configuration!)*

### Alternative: Production Build & Single-Port Server
To build the frontend and serve everything on one single port (`5000`):
```bash
npm run build
npm start
```
Then open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 6. Running Automated Tests

The application comes with 22 automated integration tests using the built-in Node.js test runner and Supertest.

To run the test suite:
```bash
npm test
```

Expected output:
```text
✔ Auth API Endpoints (243ms)
✔ Full-stack delivery test (37ms)
✔ Leads API Endpoints (81ms)

ℹ tests 22
ℹ suites 3
ℹ pass 22
ℹ fail 0
```

---

## 7. REST API Documentation

### Leads Endpoints (`/api/leads`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/leads` | List leads (supports `search`, `status`, `source`, `sortBy`, `sortOrder`, `page`, `limit`) | Optional |
| `GET` | `/api/leads/stats` | Pipeline summary metrics (`total`, `new`, `contacted`, `qualified`, `lost`) | Optional |
| `GET` | `/api/leads/:id` | Fetch a single lead by ID | Optional |
| `POST` | `/api/leads` | Create a new lead (runs schema validation) | Optional |
| `PUT` | `/api/leads/:id` | Update lead details and status | Optional |
| `DELETE` | `/api/leads/:id` | Delete a lead | Optional |

#### Example Lead Creation Payload:
```json
{
  "name": "Ananya Deshmukh",
  "email": "ananya@zenithsoft.co",
  "phone": "+91 91234 56789",
  "company": "Zenith Software",
  "source": "Website",
  "status": "Qualified",
  "notes": "Requested enterprise pricing proposal"
}
```

### Auth Endpoints (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new sales user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Log in and receive JWT token |
| `POST` | `/api/auth/demo-login` | 1-click instant login as pre-seeded demo user |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile |

---

## 8. Assumptions Made

1. **Lead Source & Status Values**: Based on standard CRM pipelines, sources are categorized as `Website`, `Referral`, `Cold Outreach`, `Social Media`, `Event`, and `Other`. Statuses follow the prompt specification: `New`, `Contacted`, `Qualified`, and `Lost`.
2. **Optional vs Required Fields**: `name`, `email`, `source`, and `status` are strictly required; `phone`, `company`, and `notes` are optional to prevent sales friction during quick lead capture.
3. **Multi-User Visibility**: Authenticated users can create leads scoped to their account. For evaluating ease, shared/unscoped leads are also accessible, and a 1-click "Demo Login" is provided.
4. **Database Portability**: SQLite was chosen so any evaluator can clone the repo and run it instantly with zero database setup, Docker containers, or environment friction.

---

## 9. What I Would Improve With More Time

1. **Activity Timeline & Audit Log**: Track change history (e.g., when a lead changed status from *Contacted* to *Qualified* and who updated it).
2. **Kanban Board View**: A drag-and-drop pipeline board (Trello-style) grouped by status columns in addition to the table view.
3. **CSV Export & Import**: Allow exporting filtered lead lists to CSV/Excel for external reporting.
4. **Email Notification Hooks**: Integration with an email service (SendGrid/Resend) to alert sales reps when a lead is marked *Qualified*.
5. **E2E Browser Tests**: Add Playwright or Cypress tests for full end-to-end browser regression checks.

---

## 10. Note on What I Found Tricky & Am Proud Of

- **Proud of:** The clean balance of zero-config developer experience with full production-readiness. Reviewers can clone the repository, run `npm test`, and see 22 tests pass in under 500ms, or run `npm run dev` and immediately interact with a pre-seeded dashboard, 1-click demo login, live search, and sorting.
- **Found tricky:** Handling debounced search and multi-faceted filtering (status tabs + source select + text search + sorting) while keeping pagination synchronized without race conditions or jittery layout shifts.
