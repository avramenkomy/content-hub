import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@example.com'
    },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
      imageUrl: '/images/users/admin.svg',
    }
  });

  const moderator = await prisma.user.upsert({
    where: {
      email: 'moderator@example.com'
    },
    update: {},
    create: {
      name: 'Moderator User',
      email: 'moderator@example.com',
      passwordHash,
      role: 'MODERATOR',
      imageUrl: '/images/users/moderator.svg',
    }
  });

  const user = await prisma.user.upsert({
    where: {
      email: 'user@example.com'
    },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      passwordHash,
      role: 'USER',
      imageUrl: '/images/users/user.svg',
    }
  });

  await prisma.post.upsert({
    where: {
      slug: 'modern-workspace-tools',
    },
    update: {},
    create: {
      title: 'Modern Workspace Tools',
      slug: 'modern-workspace-tools',
      excerpt: 'A short overview of useful tools for organizing modern digital work.',
      content: 'This demo post shows how approved content will appear on the public website. It includes an author, status, image and moderation flow.',
      imageUrl: '/images/posts/workspace.svg',
      status: 'APPROVED',
      authorId: admin.id,
    },
  });

  await prisma.post.upsert({
    where: {
      slug: 'frontend-perfomance-basics',
    },
    update: {},
    create: {
      title: 'Frontend Perfomance Basics',
      slug: 'frontend-perfomance-basics',
      excerpt: 'A beginner-friendly post about loading speed, image optimization and UX.',
      content: 'Performance is an important part of frontend development. This post is created as approved demo content for the public posts page.',
      imageUrl: '/images/posts/perfomance.svg',
      status: 'APPROVED',
      authorId: moderator.id,
    },
  });

  await prisma.post.upsert({
    where: {
      slug: 'pending-community-post',
    },
    update: {},
    create: {
      title: 'Pending Community Post',
      slug: 'pending-community-post',
      excerpt: 'This post is waiting for moderator review and should not be public yet.',
      content: 'Pending content will be visible inside the moderation dashboard, but hidden from the public posts page.',
      imageUrl: '/images/posts/community.svg',
      status: 'PENDING',
      authorId: user.id,
    },
  });


  await prisma.contactMessage.create({
    data: {
      name: 'Demo Visitor',
      email: 'visitor@example.com',
      subject: 'Question about Content Hub',
      message: 'Hello. I would like to know more about this full-stack project.'
    }
  });

  console.log('Seed data created successfuly.');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });