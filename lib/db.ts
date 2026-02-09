import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI não está definida. Configure em .env.local (local) ou nas variáveis de ambiente do Vercel (produção).");
  }
  client = new MongoClient(uri);
  await client.connect();
  db = client.db("ivida");
  return db;
}

export async function getUsersCollection() {
  const database = await getDb();
  return database.collection("users");
}
