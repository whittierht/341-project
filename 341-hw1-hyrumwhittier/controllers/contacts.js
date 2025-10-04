import { ObjectId } from 'mongodb';
import { getDb } from '../db/conn.js';


export async function getAllContacts(req, res, next) {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find({}).toArray();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}


export async function getContactById(req, res, next) {
  try {
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });

    const db = getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}


const REQUIRED = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

function validateContact(body) {
  const missing = REQUIRED.filter((f) => body[f] == null || body[f] === '');
  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) return 'Invalid email format';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.birthday)) return 'Birthday must be YYYY-MM-DD';
  return null;
}

//POST
export async function createContact(req, res, next) {
  try {
    const error = validateContact(req.body);
    if (error) return res.status(400).json({ error });

    const db = getDb();
    const result = await db.collection('contacts').insertOne(req.body);
    return res.status(201).json({ id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

//PUT
export async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });

    const error = validateContact(req.body);
    if (error) return res.status(400).json({ error });

    const db = getDb();
    const { matchedCount } = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (matchedCount === 0) return res.status(404).json({ error: 'Contact not found' });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id format' });

    const db = getDb();
    const { deletedCount } = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) return res.status(404).json({ error: 'Contact not found' });

    return res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
}
