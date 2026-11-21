# Lead Manager — Full Stack Developer Screening Assignment

> **Candidate:** Manav Mittal  
> **Role:** Full Stack Developer Screening Assignment  
> **Company:** Meru Technosoft Pvt. Ltd.  

---

## 1. Project Overview

**Lead Manager** is a lightweight, single full-stack web application designed for a sales user to capture, view, edit, and track leads. It provides a clean, responsive user interface connected to a Node.js/Express REST API and an embedded SQLite database.

The project is kept simple, clean, and strictly focused on the core assignment requirements so that every part of the architecture, data flow, validation, and database operations is straightforward to understand and explain.

---

## 2. Core Features

1. **Add a Lead**: Form to capture a new lead with `name`, `email`, `phone`, `company`, `source` (dropdown), and `status` (`New`, `Contacted`, `Qualified`, `Lost`).
2. **List Leads**: Table displaying all leads with their status shown clearly via color-coded badges.
3. **Edit a Lead**: Edit form pre-populated with lead data to update contact details and pipeline status.
4. **Delete a Lead (with Confirmation)**: Modal confirmation dialog requiring explicit user confirmation before deleting a lead.
5. **Search Leads by Name**: Real-time search that filters leads strictly by lead name.
6. **Filter Leads by Status**: Filter pills to view leads by status (`All`, `New`, `Contacted`, `Qualified`, `Lost`).
7. **Frontend & Backend Validation**:
   - `name`: Required, minimum 2 characters.
   - `email`: Required, valid email format regex check.
   - `source`: Required, must be a valid source option.
   - `status`: Required, must be one of `New`, `Contacted`, `Qualified`, or `Lost`.
   - `phone` and `company`: Optional.

---

## 3. Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (using Node.js built-in `node:sqlite` DatabaseSync — zero native C++ build tools or external database servers required).
- **Testing**: Node.js Test Runner (`node:test`) and Supertest.

### Why this stack?
- **React + Vite**: Fast development feedback, minimal boilerplate, clean component hierarchy.
- **Express**: Standard, lightweight REST API framework with minimal abstraction.
- **SQLite**: Completely self-contained and file-based. Any reviewer can clone the repository, run `npm install`, and test immediately without configuring PostgreSQL, MongoDB, or Docker.

---

## 4. Project Structure

```text
CompanyAssignment/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx  # Deletion confirmation dialog
│   │   │   ├── LeadModal.jsx           # Add & Edit lead modal form
│   │   │   ├── LeadsFilter.jsx         # Search by name & status filter pills
│   │   │   ├── LeadsTable.jsx          # Leads table with status badges & actions
│   │   │   ├── Navbar.jsx              # Simple header with title & "Add Lead" button
│   │   │   ├── StatusBadge.jsx         # Visual status badges
│   │   │   └── Toast.jsx               # Feedback notification banner
│   │   ├── services/
│   │   │   └── api.js                  # Centralized fetch API service
│   │   ├── App.jsx                     # Main application layout & state
│   │   ├── index.css                   # Tailwind CSS styling
│   │   └── main.jsx                    # React entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                  # Vite dev server with /api proxy
│
├── server/                     # Backend Express REST API
│   ├── data/                   # SQLite database storage (auto-created)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # SQLite connection, schema & initial sample seed
│   │   ├── controllers/
│   │   │   └── leadController.js       # CRUD handlers, name search, status filter
│   │   ├── middleware/
│   │   │   ├── errorHandler.js         # 404 & centralized error handler
│   │   │   └── validateLead.js         # Input validation middleware
│   │   ├── routes/
│   │   │   └── leadRoutes.js           # REST API route declarations
│   │   ├── tests/
│   │   │   └── leads.test.js           # Automated integration test suite
│   │   ├── app.js                      # Express application setup
│   │   └── server.js                   # Server entrypoint (listening on port 5000)
│   ├── .env.example
│   └── package.json
│
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore rules for node_modules, .env, *.sqlite
├── package.json                # Root package with dev, build, and test scripts
└── README.md                   # Documentation
```

---

## 5. Installation and Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ or v22/v24 recommended)
- **npm**: v9.0.0 or later

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd CompanyAssignment
```

### Step 2: Install dependencies
Install root and sub-project dependencies:
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

---

## 6. Environment Configuration

The backend reads configuration from `server/.env`. A template is provided in `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/leads.sqlite
```

If no `.env` file is present, the server defaults to port `5000` and creates the SQLite database automatically in `server/data/leads.sqlite`.

---

## 7. Running Frontend and Backend

### Option A: Development Mode (Recommended)
From the root directory, run:
```bash
npm run dev
```
This runs both the Express backend and the Vite frontend concurrently:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Option B: Production Single-Port Delivery
You can build the frontend and serve both the React app and REST API from the single backend port (`5000`):
```bash
npm run build
npm start
```
Then visit [http://localhost:5000](http://localhost:5000) in your browser.

---

## 8. Running Automated Tests

Run the backend test suite from the root directory:
```bash
npm test
```

Expected output:
```text
▶ Lead Manager API Tests
  ✔ GET /api/health returns 200 OK
  ✔ GET /api/leads returns all leads
  ✔ POST /api/leads creates a lead with valid data
  ✔ POST /api/leads validates required name
  ✔ POST /api/leads validates email format
  ✔ POST /api/leads validates status enum
  ✔ GET /api/leads/:id returns single lead
  ✔ GET /api/leads/:id returns 404 for unknown id
  ✔ PUT /api/leads/:id updates lead details and status
  ✔ GET /api/leads?search= filters leads by name only
  ✔ GET /api/leads?status= filters leads by status only
  ✔ DELETE /api/leads/:id deletes the lead
✔ Lead Manager API Tests

ℹ tests 12 | pass 12 | fail 0
```

---

## 9. API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/leads` | Retrieve all leads | `search` (name only), `status` (status filter only) |
| `GET` | `/api/leads/:id` | Retrieve a single lead by ID | None |
| `POST` | `/api/leads` | Create a new lead | None |
| `PUT` | `/api/leads/:id` | Update an existing lead & status | None |
| `DELETE` | `/api/leads/:id` | Delete a lead | None |
| `GET` | `/api/health` | Health check endpoint | None |

### Example Lead JSON Payload:
```json
{
  "name": "Aarav Patel",
  "email": "aarav.patel@techinnovate.in",
  "phone": "+91 98765 43210",
  "company": "Tech Innovate India",
  "source": "Website",
  "status": "New"
}
```

---

## 10. Validation Rules

- **Name**: Required string, trimmed, minimum 2 characters.
- **Email**: Required string, checked against standard email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- **Source**: Required string, must be one of:
  `['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other']`.
- **Status**: Required string, must be one of:
  `['New', 'Contacted', 'Qualified', 'Lost']`.
- **Phone**: Optional string.
- **Company**: Optional string.

Both frontend forms and backend middleware enforce these rules and return clear error messages.

---

## 11. Assumptions

1. **Lead Sources**: The sources dropdown offers standard lead capture channels (`Website`, `Referral`, `Cold Outreach`, `Social Media`, `Event`, `Other`).
2. **Lead Statuses**: Status follows the assignment specification: `New`, `Contacted`, `Qualified`, and `Lost`.
3. **Single Sales User**: As requested, authentication and multi-user permissions were excluded in favor of keeping the core CRUD application small, clean, and directly understandable.
4. **Seed Data**: On first startup, if the database has 0 leads, 5 realistic sample leads are seeded automatically so reviewers can immediately test filtering, search, editing, and deletion.

---

## 12. Future Improvements (With More Time)

1. **Sorting and Pagination**: Adding sortable table columns (by date or name) and paginated fetching for large datasets (e.g. 1000+ leads).
2. **Activity / Audit Log**: Recording timestamps and user notes whenever a lead moves from `New` to `Contacted` or `Qualified`.
3. **Export to CSV**: Allowing sales users to export the filtered lead list to a CSV spreadsheet.
4. **End-to-End Cypress/Playwright Tests**: Full browser-level automated test suite to complement the existing API integration tests.
