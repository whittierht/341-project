import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config.js';

let client;
let db;

export async function connectToDatabase() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables.');
  }

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();

 
  const dbNameFromUri = new URL(uri).pathname.replace('/', '') || 'test';
  db = client.db(dbNameFromUri);

  console.log('Connected to MongoDB:', db.databaseName);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}
