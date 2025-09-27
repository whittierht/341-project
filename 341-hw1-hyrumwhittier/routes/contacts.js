import { Router } from 'express';
import { getAllContacts, getContactById } from '../controllers/contacts.js';

const router = Router();

router.get('/', getAllContacts);

// Support both query param and URL param styles (assignment mentions query param)
router.get('/:id', getContactById);
router.get('/by/query', getContactById); // e.g., /contacts/by/query?id=<id>

export default router;
