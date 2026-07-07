import Container from '@/components/ui/Container';
import PostCard from '@/components/posts/PostCard';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <section className="border-b border-zinc-800 py-16 sm:py-20">
        <Container>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Public content
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Approved posts
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            These posts are loaded from PostgreSQL and displayed only after
            moderator approval.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-400">
              No approved posts yet.
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}