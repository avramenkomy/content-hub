import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

interface PostId {
  id: string,
}

type RouteContext = {
  params: Promise<PostId>
}


async function createUniqueSlug(title: string, currentPostId: string) {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    return `post-${Date.now()}`;
  }

  let slug = baseSlug;
  let count = 1;

  while(true) {
    const existPost = await prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      }
    });

    if (!existPost || existPost.id === currentPostId) {
      return slug;
    }

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
}


export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existPost = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        authorId: true,
      }
    });

    if (!existPost) {
      return NextResponse.json(
        { message: 'Post not found.' },
        { status: 404 }
      );
    }

    if (existPost.authorId !== user.id) {
      return NextResponse.json(
        { message: 'You can edit only own posts.'},
        { status: 403 },
      );
    }

    const body = await request.json();

    const title = String(body.title || '').trim();
    const excerpt = String(body.excerpt || '').trim();
    const content = String(body.content || '').trim();
    const imageUrl = String(body.imageUrl || '').trim();

    if (title.length < 3) {
      return NextResponse.json(
        { message: 'Title length must be least 3 characters'},
        { status: 400 }
      );
    }

    if (excerpt.length < 10) {
      return NextResponse.json(
        { message: 'Excerpt length must be least 10 characters'},
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { message: 'Content length must be least 20 characters'},
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(title, id);

    const patchedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        excerpt,
        content,
        imageUrl: imageUrl || null,
        status: 'PENDING',
        rejectReason: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      }
    });

    return NextResponse.json(
      {
        message: 'Post successfully updated and submitted to moderation.',
        patchedPost,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Something wrong.' },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.'},
        { status: 401 },
      );
    }

    const { id } = await params;

    const existPost = await prisma.post.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        authorId: true,
      }
    });

    if (!existPost) {
      return NextResponse.json(
        { message: 'Post not found.'},
        { status: 404 }
      );
    }

    if (existPost.authorId !== user.id) {
      return NextResponse.json(
        { message: 'You can remove only own posts.'},
        { status: 403 },
      );
    }

    await prisma.post.delete({
      where: {
        id
      },
    });

    return NextResponse.json(
      { message: 'Post successfuly deleted' },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Something wrong.' },
      { status: 500 }
    );
  }
}
