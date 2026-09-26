import { MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "math_learning_path";

if (!uri) {
  throw new Error(
    "Falta la variable de entorno MONGODB_URI. Defínela en .env.local (ver .env.local.example)."
  );
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
};

// En desarrollo, Next.js recarga los módulos en cada cambio de archivo (HMR),
// lo que crearía un MongoClient nuevo en cada recarga y agotaría el límite
// de conexiones de Atlas. Para evitarlo, cacheamos la promesa del cliente en
// una variable global que sobrevive entre recargas de módulos.
declare global {
  // eslint-disable-next-line no-var
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
  // En producción no hay HMR, así que cada instancia del proceso crea su
  // propio cliente una sola vez (el propio módulo actúa como singleton).
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Devuelve el MongoClient ya conectado. Úsalo cuando necesites acceso
 * directo al cliente (ej. transacciones multi-colección).
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Devuelve la instancia de la base de datos del proyecto, lista para usar:
 *   const db = await getDb();
 *   const activities = await db.collection("learningActivities").find().toArray();
 */
export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;