import Link from 'next/link';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
  const user = await requireRole(['ADMIN', 'MODERATOR']);

  const pendingPosts = await prisma.post.findMany({
    where: {
      status: 'PENDING'
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
  });

  return (
    <main className="py-16 sm:py-20">
      <Container>
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Moderation
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Pending posts
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Signed as {user.name}. This page is available only moderators and admins.
          </p>
        </div>

        {pendingPosts.length > 0
          ? <div className="space-y-6">
              {pendingPosts.map(post => (
                <Card key={post.id}>
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-yellow-500">
                        {post.status}
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold text-white">
                        {post.title}
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 text-sm text-zinc-500">
                        <p>{post.author.name}</p>
                        <p>{post.author.email}</p>
                      </div>
                    </div>

                    <div>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
                      >
                        Public page
                      </Link>

                      <button
                        type="button"
                        disabled
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 opacity-50"
                      >
                        Approve soon
                      </button>

                      <button
                        type="button"
                        disabled
                        className="rounded-full border border-red-900/70 px-4 py-2 text-sm text-red-200 opacity-50"
                      >
                        Reject soon
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          : <Card>
              <p className="text-zinc-400">
                No pending posts right now.
              </p>
            </Card>
        }
      </Container>
    </main>
  )
}
