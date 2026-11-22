import Lead from '../models/Lead.js';

// Get leads for the logged-in user with search, status filter, and pagination
export async function getUserLeads(req, res, next) {
  try {
    const { search = '', status = 'All', page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    // Filter strictly by the authenticated user's ID
    const filter = { user: req.userId };

    // Search by lead name only (case-insensitive)
    if (search && search.trim() !== '') {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by status only
    if (status && status !== 'All') {
      filter.status = status.trim();
    }

    // Get total matching count and paginated items in parallel
    const [totalLeads, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
    ]);

    const totalPages = Math.ceil(totalLeads / limitNumber) || 1;

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalLeads,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get dashboard counts by status for the logged-in user
export async function getDashboardCounts(req, res, next) {
  try {
    const [total, newCount, contacted, qualified, lost] = await Promise.all([
      Lead.countDocuments({ user: req.userId }),
      Lead.countDocuments({ user: req.userId, status: 'New' }),
      Lead.countDocuments({ user: req.userId, status: 'Contacted' }),
      Lead.countDocuments({ user: req.userId, status: 'Qualified' }),
      Lead.countDocuments({ user: req.userId, status: 'Lost' }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        new: newCount,
        contacted,
        qualified,
        lost,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get single lead by ID for the logged-in user
export async function getLeadById(req, res, next) {
  try {
    const { id } = req.params;

    const lead = await Lead.findOne({ _id: id, user: req.userId });
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
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }
    next(err);
  }
}

// Create new lead for the logged-in user
export async function createLead(req, res, next) {
  try {
    const { name, email, phone, company, source, status } = req.body;

    const newLead = await Lead.create({
      user: req.userId,
      name,
      email,
      phone: phone || '',
      company: company || '',
      source,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    });
  } catch (err) {
    next(err);
  }
}

// Edit / Update lead belonging to the logged-in user
export async function updateLead(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, company, source, status } = req.body;

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, user: req.userId },
      {
        name,
        email,
        phone: phone || '',
        company: company || '',
        source,
        status,
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }
    next(err);
  }
}

// Delete lead belonging to the logged-in user
export async function deleteLead(req, res, next) {
  try {
    const { id } = req.params;

    const deletedLead = await Lead.findOneAndDelete({ _id: id, user: req.userId });
    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id },
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }
    next(err);
  }
}
