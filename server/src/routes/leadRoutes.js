import { Router } from 'express';
import {
  getUserLeads,
  getDashboardCounts,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateLead } from '../middleware/validateLead.js';

const router = Router();

// Protect all lead routes — only logged-in users can access them
router.use(requireAuth);

// Dashboard counts per status
router.get('/dashboard', getDashboardCounts);

// CRUD routes
router.get('/', getUserLeads);
router.get('/:id', getLeadById);
router.post('/', validateLead, createLead);
router.put('/:id', validateLead, updateLead);
router.delete('/:id', deleteLead);

export default router;
