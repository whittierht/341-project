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
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id format' });
    }

    const db = getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}
