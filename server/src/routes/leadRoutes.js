import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { validateLead } from '../middleware/validateLead.js';

const router = Router();

// Leads REST API routes
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', validateLead, createLead);
router.put('/:id', validateLead, updateLead);
router.delete('/:id', deleteLead);

export default router;
