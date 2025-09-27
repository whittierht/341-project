import { Router } from 'express';
import { getAllContacts, getContactById } from '../controllers/contacts.js';

const router = Router();

router.get('/', getAllContacts);


router.get('/:id', getContactById);
router.get('/by/query', getContactById);

export default router;
