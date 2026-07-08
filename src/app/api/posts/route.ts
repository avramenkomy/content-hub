import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/slug';

export const runtime = 'nodejs';


async function createUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    return `post-${Date.now()}`
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingPost = await prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      }
    });

    if (!existingPost) return slug;

    counter += 1;

    slug = `${baseSlug}-${counter}`;
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body.title || '').trim();
    const excerpt = String(body.excerpt || '').trim();
    const content = String(body.content || '').trim();
    const imageUrl = String(body.imageUrl || '').trim();

    if (title.length < 4) {
      return NextResponse.json(
        { message: 'Title must be at least 4 charachters.' },
        { status: 400 }
      );
    }

    if (excerpt.length < 10) {
      return NextResponse.json(
        { message: 'Excerpt must be at least 10 charachters.' },
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { message: 'Content must be at least 20 charachters.' },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(title);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        imageUrl: imageUrl || null,
        status: 'PENDING',
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });

    return NextResponse.json(
      { message: 'Post created and submitting for moderation.', post },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    NextResponse.json(
      { message: 'Something wrong' },
      { status: 500 }
    );
  }
}
