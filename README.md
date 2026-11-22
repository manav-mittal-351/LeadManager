# Lead Manager — Full Stack Developer Screening Assignment

> **Candidate:** Manav Mittal  
> **Role:** Full Stack Developer Screening Assignment  
> **Company:** Meru Technosoft Pvt. Ltd.  

---

## 1. Project Overview

**Lead Manager** is a full-stack web application designed for sales representatives to capture, track, qualify, and manage leads. It features a modern, minimalist user interface connected to a Node.js/Express REST API and a MongoDB Atlas database using Mongoose.

The project is built with clean, beginner-friendly code, straightforward Express routes and controllers, proper authentication, and clear data isolation between users.

---

## 2. Features Implemented

### User Authentication & Data Isolation
- **User Signup**: Create an account with name, email, and password.
- **User Login**: Secure authentication with hashed passwords (`bcryptjs`) and JWT tokens (`jsonwebtoken`).
- **Data Isolation**: Each user can only view, create, edit, and delete their own leads. A user cannot access or modify another user's leads.
- **Route Protection**: All `/api/leads` routes require a valid JWT token (`requireAuth` middleware).
- **Logout**: Seamless session clearing.

### Core Lead Management
- **Add a Lead**: Form with `name`, `email`, `phone`, `company`, `source` (dropdown), and `status` (`New`, `Contacted`, `Qualified`, `Lost`).
- **List Leads**: Clean table displaying leads with subtle status badges.
- **Edit a Lead**: Pre-populated modal form to update lead details and change pipeline status.
- **Delete a Lead (with Confirmation)**: Modal confirmation dialog preventing accidental deletions.
- **Search Leads by Name**: Real-time search that filters leads strictly by lead name.
- **Filter Leads by Status**: Filter buttons to view leads by status (`All`, `New`, `Contacted`, `Qualified`, `Lost`).

### Bonus Enhancements
- **Minimalist Dashboard**: Summary metrics at the top of the page displaying counts for *Total Leads*, *New*, *Contacted*, *Qualified*, and *Lost* (calculated for the logged-in user only). Clicking a status filters the table directly.
- **Table Pagination**: Fetches leads page-by-page (10 leads per page) with *Previous* and *Next* navigation and "Page X of Y" indicators.
- **Automated Integration Tests**: 17 tests running on a separate test database (`leadmanager_automated_tests`), verifying authentication, validation, CRUD, pagination, dashboard metrics, and user isolation.

---

## 3. Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas using **Mongoose**.
- **Authentication**: JWT (`jsonwebtoken`) and password hashing with `bcryptjs`.
- **Testing**: Node.js Test Runner (`node:test`) and Supertest.

---

## 4. Project Structure

```text
CompanyAssignment/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthView.jsx            # Minimalist Sign In & Sign Up form
│   │   │   ├── DashboardCounts.jsx     # Status metrics bar (Total, New, Contacted, Qualified, Lost)
│   │   │   ├── DeleteConfirmModal.jsx  # Deletion confirmation dialog
│   │   │   ├── LeadModal.jsx           # Add & Edit lead modal form
│   │   │   ├── LeadsFilter.jsx         # Search by name & status filter pills
│   │   │   ├── LeadsTable.jsx          # Leads table with subtle badges & pagination
│   │   │   ├── Navbar.jsx              # Header with logo, user greeting, and Logout button
│   │   │   ├── StatusBadge.jsx         # Subtle visual status badge
│   │   │   └── Toast.jsx               # Feedback notification banner
│   │   ├── services/
│   │   │   └── api.js                  # Centralized fetch client with JWT auth headers
│   │   ├── App.jsx                     # Main application layout & state coordinator
│   │   ├── index.css                   # Tailwind CSS styles
│   │   └── main.jsx                    # React entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                  # Vite bundler with /api proxy
│
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB Atlas connection with Mongoose
│   │   ├── controllers/
│   │   │   ├── authController.js       # Signup, Login, and Me handlers
│   │   │   └── leadController.js       # User leads CRUD, pagination & dashboard metrics
│   │   ├── middleware/
│   │   │   ├── auth.js                 # JWT requireAuth verification & token generator
│   │   │   ├── errorHandler.js         # 404 & centralized error handler
│   │   │   └── validateLead.js         # Input validation middleware
│   │   ├── models/
│   │   │   ├── Lead.js                 # Mongoose Lead model (linked to User)
│   │   │   └── User.js                 # Mongoose User model (name, email, password)
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # Auth routes (/api/auth)
│   │   │   └── leadRoutes.js           # Protected lead routes (/api/leads)
│   │   ├── tests/
│   │   │   └── leads.test.js           # 17 automated integration tests
│   │   ├── app.js                      # Express application setup
│   │   └── server.js                   # Server entrypoint (listening on port 5000)
│   ├── .env.example
│   └── package.json
│
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore rules for node_modules, .env
├── package.json                # Root package with dev, build, and test scripts
└── README.md                   # Documentation
```

---

## 5. Installation and Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ or v22/v24 recommended)
- **npm**: v9.0.0 or later
- **MongoDB Atlas**: An active cluster on MongoDB Atlas

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

Create a `.env` file in the `server` directory. A template is provided in `server/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_jwt_secret_key_here
```

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

> **Note on Safety:** The test suite automatically connects to an isolated test database (`leadmanager_automated_tests`) so your actual MongoDB Atlas production/development data is never modified or deleted!

Expected output:
```text
Connected to SEPARATE test database: leadmanager_automated_tests
▶ Lead Manager API Integration Tests
  ✔ GET /api/health returns 200 OK
  ✔ POST /api/auth/signup creates a user and returns token
  ✔ POST /api/auth/signup rejects duplicate email
  ✔ POST /api/auth/signup validates required fields
  ✔ POST /api/auth/login authenticates valid user
  ✔ POST /api/auth/login rejects invalid password
  ✔ POST /api/auth/login rejects non-existent email
  ✔ GET /api/leads rejects unauthenticated request with 401
  ✔ POST /api/leads creates lead for authenticated user
  ✔ POST /api/leads validates required fields
  ✔ GET /api/leads returns user leads with pagination metadata
  ✔ GET /api/leads/dashboard returns status counts for user
  ✔ GET /api/leads?search= filters leads by name
  ✔ GET /api/leads?status= filters leads by status
  ✔ PUT /api/leads/:id updates lead status and details
  ✔ User B cannot view, edit, or delete User A lead
  ✔ DELETE /api/leads/:id allows User A to delete their own lead
✔ Lead Manager API Integration Tests

ℹ tests 17 | pass 17 | fail 0
```

---

## 9. REST API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/signup` | Create account (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Sign in with `email` and `password` | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |

### Leads Endpoints (`/api/leads`) — *All require `Authorization: Bearer <token>`*

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/leads/dashboard` | Get status counts for logged-in user | None |
| `GET` | `/api/leads` | Get paginated leads for logged-in user | `page`, `limit`, `search` (name only), `status` |
| `GET` | `/api/leads/:id` | Get single lead (user-isolated) | None |
| `POST` | `/api/leads` | Create a lead for logged-in user | None |
| `PUT` | `/api/leads/:id` | Update lead & status (user-isolated) | None |
| `DELETE` | `/api/leads/:id` | Delete lead (user-isolated) | None |

---

## 10. Validation Rules

- **User Signup**:
  - Name: Required, minimum 2 characters.
  - Email: Required, valid email format regex check, unique.
  - Password: Required, minimum 6 characters.
- **Lead Creation & Editing**:
  - Name: Required, minimum 2 characters.
  - Email: Required, valid email format.
  - Source: Required, one of `['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other']`.
  - Status: Required, one of `['New', 'Contacted', 'Qualified', 'Lost']`.
  - Phone & Company: Optional strings.
