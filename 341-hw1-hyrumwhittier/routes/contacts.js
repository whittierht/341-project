// routes/contacts.js
import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contacts.js';

const router = Router();

router.get('/', getAllContacts);
router.get('/by/query', getContactById);
router.get('/:id', getContactById);


router.post('/', createContact);


router.put('/:id', updateContact);


router.delete('/:id', deleteContact);

export default router;
