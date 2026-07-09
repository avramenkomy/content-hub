import Link from 'next/link';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import DeletePostButton from '@/components/posts/DeletePostButton';
import prisma from '@/lib/prisma';
import { requireCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPostsPage() {
  const user = await requireCurrentUser();

  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500 ">
              My Posts
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Your submissions
            </h2>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Create post and send them to moderation before they become public.
            </p>
          </div>

          <Link
            href="/dashboard/posts/new"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            New Post
          </Link>
        </div>

        {posts.length > 0
          ? <div>
              <div className="space-y-6">
                {posts.map(post => (
                  <Card key={post.id}>
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                          {post.status}
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold text-white">
                          {post.title}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                          {post.excerpt}
                        </p>

                        {post.rejectReason
                          ? <div className="mt-5 rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-200">
                            Reject reason: {post.rejectReason}
                          </div>
                          : null
                        }
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 text-sm">
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="rounded-full border border-zinc-700 px-4 py-2 text-center text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
                        >
                          Edit
                        </Link>

                        {post.status === "APPROVED"
                          ? <Link
                              href={`/posts/${post.slug}`}
                              className="rounded-full bg-white px-4 py-2 text-center font-semibold text-zinc-950 transition hover:bg-zinc-200"
                            >
                              View public page
                            </Link>
                          : <span className="px-4 py-2 text-center text-zinc-500">
                              Not public yet
                            </span>
                        }

                        <DeletePostButton postId={post.id} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          : <Card>
            <p className="text-zinc-400">
              You have not created any posts yet.
            </p>
          </Card>
        }
      </Container>
    </main>
  )
}