import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidEmail } from '@/lib/validation';
import { sendContactEmail } from '@/lib/mail';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (name.length < 2) {
      return NextResponse.json(
        { message: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (subject.length < 4) {
      return NextResponse.json(
        { message: 'Subject must be at least 4 characters' },
        { status: 400 }
      );
    }

    if (message.length < 4) {
      return NextResponse.json(
        { message: 'Message must be at least 4 characters' },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
      select: {
        id: true,
        createdAt: true,
      }
    });

    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        message: emailResult.skipped
          ? 'Message succesfully saved. Email sending is not configured yet.'
          : 'Message sent succesfully.',
        contactMessage,
        emailSent: !emailResult.skipped
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Somethig wrong' },
      { status: 500 }
    );
  }
}