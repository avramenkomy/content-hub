// auth helper

import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const SESSION_COOKIE_NAME = 'content_hub_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;


function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}


function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}


export async function createSession(userId: string) {
  const token = createSessionToken();
  const tokenHash = hashToken(token);

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + SESSION_MAX_AGE_SECONDS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}


export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          imageUrl: true,
          createdAt: true,
        }
      }
    },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) return null;

  return session.user;
}


export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashToken(token);

    await prisma.session.deleteMany({
      where: {
        tokenHash,
      }
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
