import Lead from '../models/Lead.js';

// Get leads with search (by name only) and filter (by status only)
export async function getLeads(req, res, next) {
  try {
    const { search = '', status = 'All' } = req.query;

    const filter = {};

    // Search by lead name only (case-insensitive)
    if (search && search.trim() !== '') {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by status only
    if (status && status !== 'All') {
      filter.status = status.trim();
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (err) {
    next(err);
  }
}

// Get single lead by ID
export async function getLeadById(req, res, next) {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
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
    // If invalid MongoDB ObjectId format, return 404
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }
    next(err);
  }
}

// Create new lead
export async function createLead(req, res, next) {
  try {
    const { name, email, phone, company, source, status } = req.body;

    const newLead = await Lead.create({
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

// Edit / Update lead
export async function updateLead(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone, company, source, status } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
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

// Delete lead
export async function deleteLead(req, res, next) {
  try {
    const { id } = req.params;

    const deletedLead = await Lead.findByIdAndDelete(id);
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
