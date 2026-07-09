import Link from 'next/link';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import UserRoleActions from '@/components/admin/UserRoleActions';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireRole(['ADMIN']);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  const totalPosts = await prisma.post.count();
  const pendingPosts = await prisma.post.count({
    where: {
      status: 'PENDING',
    },
  });
  const contactMessages = await prisma.contactMessage.count();

  return (
    <main className="py-16 sm:py-20">
      <Container>
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Admin dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Signed in as {user.name}. This page is available only for admins.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <p className="text-sm text-zinc-500">Users</p>
            <p className="mt-2 text-3xl font-bold text-white">{users.length}</p>
          </Card>

          <Card>
            <p className="text-sm text-zinc-500">Posts</p>
            <p className="mt-2 text-3xl font-bold text-white">{totalPosts}</p>
          </Card>

          <Card>
            <p className="text-sm text-zinc-500">Pending posts</p>
            <p className="mt-2 text-3xl font-bold text-white">{pendingPosts}</p>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <p className="text-sm text-zinc-500">Contact messages</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {contactMessages}
            </p>

            <Link
              href="/admin/messages"
              className="mt-5 inline-flex text-sm font-medium text-white hover:text-zinc-300"
            >
              Open messages
            </Link>
          </Card>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-white">Users</h2>

          <div className="mt-6 space-y-4">
            {users.map(usr => (
              <Card key={usr.id}>
                <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
                  <div>
                    <p className="text-lg font-semibold text-white">{usr.name}</p>

                    <p className="mt-2 break-all text-sm text-zinc-400">{usr.email}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500">
                      <span>Current role: {usr.role}</span>
                      <span>Posts: {usr._count.posts}</span>
                    </div>
                  </div>

                  <UserRoleActions
                    userId={usr.id}
                    currentRole={usr.role}
                    disabled={usr.id === user.id}
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}