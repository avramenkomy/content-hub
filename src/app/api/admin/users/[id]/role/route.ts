import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>
}

const allowedRoles = ['USER', 'MODERATOR', 'ADMIN'] as const; // QST:

type Role = (typeof allowedRoles)[number]


function isAllowedRole(value: string): value is Role {
  return allowedRoles.includes(value as Role);
}


export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Authentication required.'},
        { status: 401 }
      );
    }

    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (id === currentUser.id) {
      return NextResponse.json(
        { message: 'You cannot change your own role.'},
        { status: 400 }
      );
    }

    const body = await request.json();
    const role = String(body.role || '').trim();

    if (!isAllowedRole(role)) {
      return NextResponse.json(
        { message: 'Invalid role.' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.'},
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json(
      { message: 'User role successfully updated.', updatedUser,},
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Something wrong.'},
      { status: 500 }
    );
  }
}