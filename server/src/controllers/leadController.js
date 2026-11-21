import { db } from '../config/db.js';

// Get leads with search (by name only) and filter (by status only)
export function getLeads(req, res, next) {
  try {
    const { search = '', status = 'All' } = req.query;

    const conditions = [];
    const params = [];

    // Search by name only (case-insensitive LIKE)
    if (search && search.trim() !== '') {
      conditions.push('name LIKE ?');
      params.push(`%${search.trim()}%`);
    }

    // Filter by status only
    if (status && status !== 'All') {
      conditions.push('status = ?');
      params.push(status.trim());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT id, name, email, phone, company, source, status, created_at, updated_at
      FROM leads
      ${whereClause}
      ORDER BY id DESC
    `;

    const leads = db.prepare(query).all(...params);

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (err) {
    next(err);
  }
}

// Get single lead by ID
export function getLeadById(req, res, next) {
  try {
    const { id } = req.params;
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    next(err);
  }
}

// Create new lead
export function createLead(req, res, next) {
  try {
    const { name, email, phone, company, source, status } = req.body;

    const insertStmt = db.prepare(`
      INSERT INTO leads (name, email, phone, company, source, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      name,
      email,
      phone || '',
      company || '',
      source,
      status
    );

    const newLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    });
  } catch (err) {
    next(err);
  }
}

// Edit / Update lead
export function updateLead(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, company, source, status } = req.body;

    const existing = db.prepare('SELECT id FROM leads WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    const updateStmt = db.prepare(`
      UPDATE leads
      SET name = ?, email = ?, phone = ?, company = ?, source = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(
      name,
      email,
      phone || '',
      company || '',
      source,
      status,
      id
    );

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (err) {
    next(err);
  }
}

// Delete lead
export function deleteLead(req, res, next) {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT id, name FROM leads WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    db.prepare('DELETE FROM leads WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id: Number(id) },
    });
  } catch (err) {
    next(err);
  }
}
