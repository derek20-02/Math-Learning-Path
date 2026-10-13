import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME ?? 'math_learning';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
    if (!MONGODB_URI) {
        throw new Error('Please define MONGODB_URI in .env.local');
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
    .connect(MONGODB_URI, { dbName: MONGODB_DB_NAME })
    .then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}