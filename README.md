# Lead Manager — Sales Pipeline & CRM

A modern, minimalist full-stack lead management platform built with React, Node.js, Express, and MongoDB Atlas. It allows sales representatives to capture, track, qualify, and organize leads with user-level data isolation, real-time status metrics, and table pagination.

🚀 **Live Demo:** [https://lead-manager-henna-nu.vercel.app](https://lead-manager-henna-nu.vercel.app)

---

## Features

### 1. User Authentication & Data Isolation
- **Signup & Login:** Secure authentication with `bcryptjs` password hashing and `jsonwebtoken` (JWT).
- **Data Isolation:** Every lead is strictly scoped to the logged-in user (`user: req.userId`). Users can only access, edit, and delete their own leads.
- **Protected Routes:** All lead endpoints are protected with custom `requireAuth` middleware.

### 2. Core Lead Management
- **Add Leads:** Capture name, email, phone, company, source (dropdown), and status (`New`, `Contacted`, `Qualified`, `Lost`).
- **List Leads:** Clean, responsive table showing contact info, lead source, and subtle status badges.
- **Edit Leads:** Update lead details and pipeline status via a modal form.
- **Delete Leads:** Safe deletion with a modal confirmation step.
- **Search by Name:** Real-time search that filters strictly by lead name.
- **Filter by Status:** Filter leads by `All`, `New`, `Contacted`, `Qualified`, or `Lost`.

### 3. Pipeline Metrics & Table Pagination
- **Status Dashboard:** Real-time counters showing total leads and counts per status for the logged-in user. Clicking any card filters the table.
- **Pagination:** Server-side pagination (10 leads per page) with Previous/Next controls and page indicators.

### 4. Validation & Error Handling
- **Frontend Validation:** Immediate feedback for invalid emails, missing required fields, or short passwords.
- **Backend Validation:** Validates request bodies and sanitizes input before touching the database.
- **Centralized Error Handling:** Consistent JSON error responses across all endpoints.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express.js, ES Modules |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Testing** | Node.js Test Runner (`node:test`), Supertest |
| **Deployment** | Vercel (Edge CDN + Serverless Functions) |

---

## Project Structure

```text
LeadManager/
├── api/
│   └── index.js                # Vercel serverless entrypoint
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # UI Components (Table, Modals, Filters, Dashboard, Auth)
│   │   ├── services/           # Centralized API service with auth token handling
│   │   ├── App.jsx             # Main layout & state coordinator
│   │   └── main.jsx            # React root
│   ├── package.json
│   └── vite.config.js          # Vite config with local development proxy
├── server/                     # Backend Express API
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection with serverless caching
│   │   ├── controllers/        # Auth & Lead route controllers
│   │   ├── middleware/         # Auth verification, lead validation, error handler
│   │   ├── models/             # Mongoose User and Lead schemas
│   │   ├── routes/             # Express API routes (/api/auth, /api/leads)
│   │   ├── tests/              # Automated API integration tests
│   │   ├── app.js              # Express app setup & middleware
│   │   └── server.js           # Local HTTP server entrypoint
│   └── package.json
├── vercel.json                 # Vercel deployment configuration
├── package.json                # Root package with dev, build, and test scripts
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB Atlas**: An active cluster

### 1. Clone the repository
```bash
git clone https://github.com/manav-mittal-351/LeadManager.git
cd LeadManager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `server` directory (reference template in `server/.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Run locally
```bash
npm run dev
```
This runs both backend and frontend concurrently:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Running Automated Tests

Run the integration test suite from the root directory:
```bash
npm test
```

> **Database Safety:** The test suite connects to an isolated test database (`leadmanager_automated_tests`) and includes safety guards to ensure production data is never touched or deleted.

```text
✔ 17 / 17 integration tests passing
```

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/signup` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes (Bearer Token) |

### Leads (`/api/leads`) — *Requires `Authorization: Bearer <token>`*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leads/dashboard` | Get pipeline counts (Total, New, Contacted, Qualified, Lost) |
| `GET` | `/api/leads` | Get paginated leads (Supports `?page=`, `?limit=`, `?search=`, `?status=`) |
| `GET` | `/api/leads/:id` | Get single lead by ID |
| `POST` | `/api/leads` | Create a new lead |
| `PUT` | `/api/leads/:id` | Update lead details or status |
| `DELETE` | `/api/leads/:id` | Delete lead by ID |

---

## Deployment (Vercel)

The repository is configured for serverless deployment on [Vercel](https://vercel.com):
- **Build Command:** `npm run build`
- **Output Directory:** `client/dist`
- **Serverless API:** Automatically routes `/api/*` to `api/index.js`
- **Environment Variables Required on Vercel:**
  - `MONGODB_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: Secret key for JWT signing
- In MongoDB Atlas, ensure **Network Access** allows `0.0.0.0/0` (Allow access from anywhere) so Vercel serverless functions can connect.
