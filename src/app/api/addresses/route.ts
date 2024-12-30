import { NextResponse } from 'next/server';
import { getPayloadClient } from '../../../get-payload';
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
    const { address, chain, storageType, accessType, notes, tags } = body;

    console.log('Received address creation request:', { address, chain, storageType, accessType }); // Debug log

    const cookieStore = cookies();
    const token = cookieStore.get('payload-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'You must be logged in to create an address' },
        { status: 401 }
      );
    }

    try {
      const payload = await getPayloadClient();
      console.log('Payload client initialized'); // Debug log

      // Decode JWT token to get user ID
      const decoded = jwt.decode(token) as PayloadToken | null;

      if (!decoded?.user?.id) {
        return NextResponse.json(
          { message: 'Invalid authentication token' },
          { status: 401 }
        );
      }

      console.log('Creating address for user:', decoded.user.id); // Debug log

      // Create the address with owner field
      const newAddress = await payload.create({
        collection: 'addresses',
        data: {
          address,
          chain,
          storageType,
          accessType,
          notes: notes || '',
          tags: Array.isArray(tags) ? tags : [],
          owner: decoded.user.id,
        },
      });

      console.log('Address created successfully:', newAddress.id); // Debug log

      return NextResponse.json(
        { message: 'Address created successfully', address: newAddress },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Error in address creation:', error); // Debug log
      if (error.message?.includes('ValidationError')) {
        return NextResponse.json(
          { message: 'Validation error', details: error.message },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: unknown) {
    console.error('Address creation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error creating address' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('payload-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'You must be logged in to view addresses' },
        { status: 401 }
      );
    }

    const payload = await getPayloadClient();

    // Decode JWT token to get user ID
    const decoded = jwt.decode(token) as PayloadToken | null;

    if (!decoded?.user?.id) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const addresses = await payload.find({
      collection: 'addresses',
      where: {
        owner: {
          equals: decoded.user.id,
        },
      },
    });

    return NextResponse.json(addresses);
  } catch (error: unknown) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error fetching addresses' },
      { status: 500 }
    );
  }
}
