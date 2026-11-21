import { db } from '../config/db.js';

// Get all leads with search, filter, sort, and pagination
export function getLeads(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      search = '',
      status = 'All',
      source = 'All',
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const offset = (pageNum - 1) * limitNum;

    // Validate sort parameters to prevent SQL injection
    const allowedSortColumns = ['name', 'email', 'company', 'status', 'source', 'created_at'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Construct query conditions
    const conditions = [];
    const params = [];

    // Filter by user if authenticated
    if (userId) {
      conditions.push('(user_id = ? OR user_id IS NULL)');
      params.push(userId);
    }

    // Filter by status
    if (status && status !== 'All') {
      conditions.push('status = ?');
      params.push(status);
    }

    // Filter by source
    if (source && source !== 'All') {
      conditions.push('source = ?');
      params.push(source);
    }

    // Search by name, email, or company
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      conditions.push('(name LIKE ? OR email LIKE ? OR company LIKE ?)');
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total matching leads
    const countQuery = `SELECT COUNT(*) as count FROM leads ${whereClause}`;
    const countStmt = db.prepare(countQuery);
    const totalCount = countStmt.get(...params).count;

    // Fetch paginated leads
    const leadsQuery = `
      SELECT id, user_id, name, email, phone, company, source, status, notes, created_at, updated_at
      FROM leads
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;

    const leadsStmt = db.prepare(leadsQuery);
    const leads = leadsStmt.all(...params, limitNum, offset);

    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get lead stats (counts by status)
export function getLeadStats(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    let whereClause = '';
    const params = [];

    if (userId) {
      whereClause = 'WHERE (user_id = ? OR user_id IS NULL)';
      params.push(userId);
    }

    const totalStmt = db.prepare(`SELECT COUNT(*) as count FROM leads ${whereClause}`);
    const total = totalStmt.get(...params).count;

    const statsStmt = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM leads
      ${whereClause}
      GROUP BY status
    `);
    const statusCounts = statsStmt.all(...params);

    const stats = {
      total,
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0,
    };

    for (const item of statusCounts) {
      const key = item.status.toLowerCase();
      if (stats.hasOwnProperty(key)) {
        stats[key] = item.count;
      }
    }

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

// Get single lead by ID
export function getLeadById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    let query = 'SELECT * FROM leads WHERE id = ?';
    const params = [id];

    if (userId) {
      query += ' AND (user_id = ? OR user_id IS NULL)';
      params.push(userId);
    }

    const lead = db.prepare(query).get(...params);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found`,
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
    const userId = req.user ? req.user.id : null;
    const { name, email, phone, company, source, status, notes } = req.body;

    const insertStmt = db.prepare(`
      INSERT INTO leads (user_id, name, email, phone, company, source, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      userId,
      name,
      email,
      phone || null,
      company || null,
      source,
      status,
      notes || null
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

// Update lead
export function updateLead(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;
    const { name, email, phone, company, source, status, notes } = req.body;

    // Check if lead exists
    let checkQuery = 'SELECT id FROM leads WHERE id = ?';
    const checkParams = [id];
    if (userId) {
      checkQuery += ' AND (user_id = ? OR user_id IS NULL)';
      checkParams.push(userId);
    }

    const existing = db.prepare(checkQuery).get(...checkParams);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found`,
      });
    }

    const updateStmt = db.prepare(`
      UPDATE leads
      SET name = ?, email = ?, phone = ?, company = ?, source = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(
      name,
      email,
      phone || null,
      company || null,
      source,
      status,
      notes || null,
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
    const userId = req.user ? req.user.id : null;

    let checkQuery = 'SELECT id, name FROM leads WHERE id = ?';
    const checkParams = [id];
    if (userId) {
      checkQuery += ' AND (user_id = ? OR user_id IS NULL)';
      checkParams.push(userId);
    }

    const existing = db.prepare(checkQuery).get(...checkParams);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found`,
      });
    }

    db.prepare('DELETE FROM leads WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: `Lead "${existing.name}" deleted successfully`,
      data: { id: Number(id) },
    });
  } catch (err) {
    next(err);
  }
}
