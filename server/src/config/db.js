import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.join(dbDir, 'leads.sqlite');

// Initialize database
export const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for performance and data integrity
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
`);

export function initDatabase() {
  // Users table (for optional authentication)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Lost')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_name ON leads(name);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  // Seed default demo user and sample leads if empty
  seedInitialData();
}

function seedInitialData() {
  const userCountStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const userCount = userCountStmt.get().count;

  let demoUserId = 1;

  if (userCount === 0) {
    const demoPasswordHash = bcrypt.hashSync('demo123', 10);
    const insertUser = db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    );
    const result = insertUser.run('Sales Rep Demo', 'demo@merutech.com', demoPasswordHash);
    demoUserId = Number(result.lastInsertRowid);
  } else {
    const firstUser = db.prepare('SELECT id FROM users LIMIT 1').get();
    if (firstUser) demoUserId = firstUser.id;
  }

  const leadCountStmt = db.prepare('SELECT COUNT(*) as count FROM leads');
  const leadCount = leadCountStmt.get().count;

  if (leadCount === 0) {
    const insertLead = db.prepare(`
      INSERT INTO leads (user_id, name, email, phone, company, source, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', ?), datetime('now', ?))
    `);

    const sampleLeads = [
      {
        name: 'Aarav Patel',
        email: 'aarav.patel@techinnovate.in',
        phone: '+91 98765 43210',
        company: 'Tech Innovate India',
        source: 'Website',
        status: 'New',
        offset: '-4 days',
      },
      {
        name: 'Sneha Sharma',
        email: 'sneha@fintechcore.com',
        phone: '+91 98220 11223',
        company: 'Fintech Core Systems',
        source: 'Referral',
        status: 'Contacted',
        offset: '-3 days',
      },
      {
        name: 'Michael Chen',
        email: 'mchen@apexlogistics.io',
        phone: '+1 415 555 0192',
        company: 'Apex Logistics',
        source: 'Cold Outreach',
        status: 'Qualified',
        offset: '-2 days',
      },
      {
        name: 'Priya Mukherjee',
        email: 'priya.m@cloudscale.net',
        phone: '+91 99887 76655',
        company: 'CloudScale Networks',
        source: 'Social Media',
        status: 'New',
        offset: '-1 days',
      },
      {
        name: 'David Miller',
        email: 'david.m@nexusenterprises.com',
        phone: '+1 212 555 0148',
        company: 'Nexus Enterprises',
        source: 'Event',
        status: 'Lost',
        offset: '-6 hours',
      },
      {
        name: 'Ananya Deshmukh',
        email: 'ananya@zenithsoft.co',
        phone: '+91 91234 56789',
        company: 'Zenith Software',
        source: 'Website',
        status: 'Qualified',
        offset: '-3 hours',
      },
      {
        name: 'Robert Vance',
        email: 'robert@vancerefrigeration.com',
        phone: '+1 570 555 0123',
        company: 'Vance Refrigeration',
        source: 'Other',
        status: 'Contacted',
        offset: '-1 hour',
      },
    ];

    for (const lead of sampleLeads) {
      insertLead.run(
        demoUserId,
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.source,
        lead.status,
        lead.offset,
        lead.offset
      );
    }
  }
}
