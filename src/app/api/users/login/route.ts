import { NextResponse } from 'next/server';
import { getPayloadClient } from '../../../../get-payload';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface PayloadToken {
  user: {
    id: string;
  };
  exp: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const payload = await getPayloadClient();

    // Attempt to log in
    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    });

    if (!result.token) {
      throw new Error('Failed to generate authentication token');
    }

    // Set the token in a cookie
    const response = NextResponse.json(
      { message: 'Login successful', user: result.user },
      { status: 200 }
    );

    // Set cookie with domain and other necessary options
    response.cookies.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7200, // 2 hours
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Invalid credentials' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('payload-token');

    if (token) {
      try {
        const payload = await getPayloadClient();
        // Just clear the token on the server side
        console.log('Clearing server-side session');
      } catch (logoutError) {
        console.error('Payload error:', logoutError);
        // Continue with cookie deletion even if Payload operation fails
      }
    }

    // Create response with cleared cookie
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the cookie by setting multiple variations
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    // Also clear with different paths
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
      maxAge: 0,
      expires: new Date(0),
    });

    // Clear any other variations
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api',
      maxAge: 0,
      expires: new Date(0),
    });

    // Also set cookie header directly
    response.headers.set(
      'Set-Cookie',
      [
        'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
        'payload-token=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
        'payload-token=; path=/api; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
      ].join(', ')
    );

    return response;
  } catch (error: unknown) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error logging out' },
      { status: 500 }
    );
  }
}
