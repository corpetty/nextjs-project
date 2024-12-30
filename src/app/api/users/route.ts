import { NextResponse } from 'next/server';
import payload from 'payload';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role: role || 'user',
      },
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error creating user' },
      { status: 500 }
    );
  }
}
