import { Router } from 'express';
import {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateLead } from '../middleware/validateLead.js';

const router = Router();

// Apply optional authentication across all lead routes
router.use(optionalAuth);

// Leads stats for dashboard counter
router.get('/stats', getLeadStats);

// List leads with search, filter, sort, and pagination
router.get('/', getLeads);

// Get single lead
router.get('/:id', getLeadById);

// Create new lead with validation
router.post('/', validateLead, createLead);

// Update lead with validation
router.put('/:id', validateLead, updateLead);

// Delete lead
router.delete('/:id', deleteLead);

export default router;
