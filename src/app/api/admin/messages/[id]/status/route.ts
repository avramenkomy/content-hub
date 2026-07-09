import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>
}

const allowedStatuses = ['NEW', 'READ', 'ARCHIVED'] as const;

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 400 }
      );
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Admin success required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const status = String(body.status || '');

    if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
      return NextResponse.json(
        { message: 'Invalid message status.'},
        { status: 400 }
      );
    }

    const existMessage = await prisma.contactMessage.findUnique({
      where: {
        id
      },
      select: {
        id: true,
      }
    });

    if (!existMessage) {
      return NextResponse.json(
        { message: 'Message is not found.' },
        { status: 404 }
      );
    }

    const patchedMessage = await prisma.contactMessage.update({
      where: {
        id,
      },
      data: {
        status: status as (typeof allowedStatuses)[number]
      },
      select: {
        id: true,
        status: true,
      }
    });

    return NextResponse.json(
      { message: 'Message status succesfuly updated.', patchedMessage },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Something wrong.' },
      { status: 500 }
    );
  }
}
