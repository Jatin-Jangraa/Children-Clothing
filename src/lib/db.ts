import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cloth-store";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastError: number;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, lastError: 0 };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
      });

      cached.conn = await cached.promise;
      cached.promise = null;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      if (attempt === MAX_RETRIES) {
        cached.lastError = Date.now();
        throw e;
      }
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
    }
  }

  throw new Error("Failed to connect to MongoDB after retries");
}
