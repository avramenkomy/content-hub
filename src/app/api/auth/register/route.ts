import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { isValidEmail, isValidPassword } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 400 }
      );
    }

    const existiongUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (existiongUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    await createSession(user.id);

    return NextResponse.json(
      { message: 'Registered successfully.' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Something wrong' },
      { status: 500 }
    );
  }
}