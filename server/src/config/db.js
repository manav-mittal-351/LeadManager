import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data folder exists
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.join(dbDir, 'leads.sqlite');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode for performance
db.exec(`PRAGMA journal_mode = WAL;`);

export function initDatabase() {
  // Create leads table with required fields
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Lost')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Indexes for search and filter performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_leads_name ON leads(name);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  `);

  seedSampleLeads();
}

function seedSampleLeads() {
  const count = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO leads (name, email, phone, company, source, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const sampleLeads = [
    ['Aarav Patel', 'aarav.patel@techinnovate.in', '+91 98765 43210', 'Tech Innovate India', 'Website', 'New'],
    ['Sneha Sharma', 'sneha@fintechcore.com', '+91 98220 11223', 'Fintech Core Systems', 'Referral', 'Contacted'],
    ['Michael Chen', 'mchen@apexlogistics.io', '+1 415 555 0192', 'Apex Logistics', 'Cold Outreach', 'Qualified'],
    ['Priya Mukherjee', 'priya.m@cloudscale.net', '+91 99887 76655', 'CloudScale Networks', 'Social Media', 'New'],
    ['David Miller', 'david.m@nexusenterprises.com', '+1 212 555 0148', 'Nexus Enterprises', 'Event', 'Lost'],
  ];

  for (const lead of sampleLeads) {
    insert.run(...lead);
  }
}
