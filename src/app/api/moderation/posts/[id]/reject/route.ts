import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ id: string }>
}


export async function POST(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!['MODERATOR', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { message: 'You do not have permission to moderate points.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const reason = String(body.reason || '').trim();

    if (!reason) {
      return NextResponse.json(
        { message: 'Reject reason is required.' },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
      }
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found.' },
        { status: 404 }
      );
    }

    if (post.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Only pending posts can be approved.' },
        { status: 400 },
      );
    }

    const rejectedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        status: 'REJECTED',
        rejectReason: reason,
      },
      select: {
        id: true,
        title: true,
        status: true,
        rejectReason: true,
      },
    });

    return NextResponse.json(
      { message: 'Post will be reject.', post: rejectedPost },
      { status: 201 }
    );


  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something wrong'},
      { status: 500 }
    );
  }
}