import { MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "math_learning";

if (!uri) {
  throw new Error(
    "The MONGODB_URI environment variable is missing. Define it in .env.local (see .env.local.example)."
  );
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
};

// In development, Next.js reloads modules whenever a file changes (HMR).
// This could create a new MongoClient on every reload and eventually exhaust
// the Atlas connection limit. To prevent this, the client promise is cached
// in a global variable that persists across module reloads.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  // In production there is no HMR, so each process instance creates
  // its MongoClient only once. The module itself acts as a singleton.
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Returns the connected MongoClient.
 *
 * Use this when direct access to the client is required,
 * for example, for multi-collection transactions.
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Returns the project's database instance, ready to use.
 *
 * Example:
 *   const db = await getDb();
 *   const activities = await db
 *     .collection("learning_Activity")
 *     .find()
 *     .toArray();
 */
export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
