# Lead Manager — Full Stack Developer Screening Assignment

> **Candidate:** Manav Mittal  
> **Role:** Full Stack Developer Screening Assignment  
> **Company:** Meru Technosoft Pvt. Ltd.  

---

## 1. Project Overview

**Lead Manager** is a single full-stack web application designed for a sales user to capture, view, edit, and track leads. It provides a clean, responsive user interface connected to a Node.js/Express REST API and a MongoDB Atlas database using Mongoose.

The project is kept simple, clean, and beginner-friendly, with straightforward Express controllers, a single Mongoose Lead model, and zero unnecessary abstractions so that every part can be easily explained during an interview.

---

## 2. Core Features

1. **Add a Lead**: Form to capture a new lead with `name`, `email`, `phone`, `company`, `source` (dropdown), and `status` (`New`, `Contacted`, `Qualified`, `Lost`).
2. **List Leads**: Table displaying all leads with their status shown clearly via color-coded badges.
3. **Edit a Lead**: Edit form pre-populated with lead data to update contact details and pipeline status.
4. **Delete a Lead (with Confirmation)**: Modal confirmation dialog requiring explicit user confirmation before deleting a lead.
5. **Search Leads by Name**: Real-time search that filters leads strictly by lead name.
6. **Filter Leads by Status**: Filter buttons to view leads by status (`All`, `New`, `Contacted`, `Qualified`, `Lost`).
7. **Frontend & Backend Validation**:
   - `name`: Required, minimum 2 characters.
   - `email`: Required, valid email format regex check.
   - `source`: Required, must be a valid source option (`Website`, `Referral`, `Cold Outreach`, `Social Media`, `Event`, `Other`).
   - `status`: Required, must be one of `New`, `Contacted`, `Qualified`, or `Lost`.
   - `phone` and `company`: Optional strings.

---

## 3. Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas using **Mongoose** for data modeling and validation.
- **Testing**: Node.js Test Runner (`node:test`) and Supertest.

### Why this stack?
- **React + Vite**: Fast development, minimal boilerplate, clean component hierarchy.
- **Express**: Lightweight, standard Node.js REST API framework.
- **MongoDB Atlas + Mongoose**: Cloud-hosted document database with simple, declarative schema validation.

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
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB Atlas connection via Mongoose
│   │   ├── controllers/
│   │   │   └── leadController.js       # CRUD handlers, name search & status filter
│   │   ├── middleware/
│   │   │   ├── errorHandler.js         # 404 & centralized error handler
│   │   │   └── validateLead.js         # Input validation middleware
│   │   ├── models/
│   │   │   └── Lead.js                 # Mongoose Lead schema and model
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

The backend reads configuration from `server/.env`. A template is provided in `server/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Create a `.env` file in the `server` folder and set `MONGODB_URI` with your MongoDB Atlas connection string.

---

## 7. How MongoDB Atlas is Connected

1. The database connection code lives in a simple, dedicated file: `server/src/config/db.js`.
2. It uses `mongoose.connect(process.env.MONGODB_URI)` to establish a connection to your MongoDB Atlas cluster.
3. The connection is initiated once when the Express application boots in `server/src/app.js`.
4. The Mongoose `Lead` model in `server/src/models/Lead.js` manages documents in the `leads` collection.

---

## 8. Running Frontend and Backend

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

## 9. Running Automated Tests

Run the backend test suite from the root directory:
```bash
npm test
```

Expected output:
```text
▶ Lead Manager API Tests (MongoDB)
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
✔ Lead Manager API Tests (MongoDB)

ℹ tests 12 | pass 12 | fail 0
```

---

## 10. API Endpoints

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

## 11. Validation Rules

- **Name**: Required string, trimmed, minimum 2 characters.
- **Email**: Required string, lowercase, checked against standard email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- **Source**: Required string, must be one of:
  `['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Event', 'Other']`.
- **Status**: Required string, must be one of:
  `['New', 'Contacted', 'Qualified', 'Lost']`.
- **Phone**: Optional string.
- **Company**: Optional string.

---

## 12. Assumptions

1. **Lead Sources**: The sources dropdown offers standard lead capture channels (`Website`, `Referral`, `Cold Outreach`, `Social Media`, `Event`, `Other`).
2. **Lead Statuses**: Status follows the assignment specification: `New`, `Contacted`, `Qualified`, and `Lost`.
3. **Database**: MongoDB Atlas via Mongoose is used as the document database, configured via the `MONGODB_URI` environment variable.

---

## 13. Future Improvements (With More Time)

1. **Sorting and Pagination**: Adding sortable table columns and paginated fetching for large datasets.
2. **Activity / Audit Log**: Recording timestamps whenever a lead moves from `New` to `Contacted` or `Qualified`.
3. **Export to CSV**: Allowing sales users to export the filtered lead list to a CSV spreadsheet.
