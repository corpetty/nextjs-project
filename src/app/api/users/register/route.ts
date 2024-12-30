import { NextResponse } from 'next/server';
import { getPayloadClient } from '../../../../get-payload';
import type { Payload } from 'payload';

interface PayloadUser {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface PayloadLoginResponse {
  token: string;
  user: PayloadUser;
}

// Export the POST handler
export async function POST(req: Request) {
  console.log('Register API route hit'); // Debug log

  try {
    const body = await req.json();
    const { email, password } = body;

    console.log('Received registration request for:', email); // Debug log

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    let payload: Payload;
    try {
      console.log('Initializing Payload client...'); // Debug log
      payload = await getPayloadClient();
      console.log('Payload client initialized'); // Debug log
    } catch (initError) {
      console.error('Payload initialization error:', initError);
      return NextResponse.json(
        { message: 'Server configuration error', details: initError instanceof Error ? initError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    try {
      // Create the user
      console.log('Creating user...'); // Debug log
      const user = await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          role: 'user',
        },
      }) as PayloadUser;

      console.log('User created:', user.id); // Debug log

      // Log the user in
      console.log('Logging in user...'); // Debug log
      const result = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      }) as PayloadLoginResponse;

      if (!result?.token) {
        throw new Error('Failed to generate authentication token');
      }

      console.log('Login successful, setting cookie...'); // Debug log

      // Set the token in a cookie
      const response = NextResponse.json(
        { message: 'Registration successful', user },
        { status: 201 }
      );

      // Set cookie with all necessary options
      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7200, // 2 hours
      });

      console.log('Registration complete'); // Debug log
      return response;
    } catch (operationError: any) {
      console.error('User operation error:', operationError);
      
      // Check for specific error types
      if (operationError.message?.includes('duplicate key error')) {
        return NextResponse.json(
          { message: 'Email already exists' },
          { status: 400 }
        );
      }

      // Handle validation errors
      if (operationError.errors) {
        return NextResponse.json(
          { message: 'Validation error', errors: operationError.errors },
          { status: 400 }
        );
      }

      // Handle MongoDB connection errors
      if (operationError.name === 'MongoServerError') {
        return NextResponse.json(
          { message: 'Database connection error', details: operationError.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: operationError.message || 'Error creating user', details: operationError },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error processing request', details: error },
      { status: 500 }
    );
  }
}
