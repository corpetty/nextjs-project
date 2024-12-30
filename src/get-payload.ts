import payload, { Payload } from 'payload';
import { InitOptions } from 'payload/config';

interface CachedPayload {
  client: Payload | null;
  promise: Promise<Payload> | null;
}

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({ initOptions }: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing');
  }

  // If we have a cached client, return it
  if (cached.client) {
    return cached.client;
  }

  // If we're already initializing, return the promise
  if (cached.promise) {
    return cached.promise;
  }

  // Initialize Payload
  cached.promise = payload.init({
    secret: process.env.PAYLOAD_SECRET,
    local: true,
    mongoURL: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crypto-portfolio',
    mongoOptions: {
      connectTimeoutMS: 60000, // 1 minute
      socketTimeoutMS: 60000,  // 1 minute
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,    // 1 minute
      serverSelectionTimeoutMS: 60000, // 1 minute
    },
    onInit: async () => {
      console.log('Payload initialized in API route');
    },
    ...initOptions,
  } as InitOptions);

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    console.error('Payload initialization error:', e);
    cached.promise = null;
    throw new Error(e instanceof Error ? e.message : 'Failed to initialize Payload');
  }

  return cached.client;
};
