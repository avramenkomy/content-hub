import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug,
      status: "APPROVED",
    },
    include: {
      author: {
        select: {
          name: true,
          imageUrl: true,
          role: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main>
      <article className="py-16 sm:py-20">
        <Container>
          <Button href="/posts" variant="secondary">
            Back to posts
          </Button>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                Approved post
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {post.title}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
                {post.excerpt}
              </p>

              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="mt-10 h-auto w-full rounded-3xl border border-zinc-800 object-cover"
                />
              ) : null}

              <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8">
                <p className="whitespace-pre-line text-base leading-8 text-zinc-300">
                  {post.content}
                </p>
              </div>
            </div>

            <aside>
              <Card>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                  Author
                </p>

                <div className="mt-5 flex items-center gap-4">
                  {post.author.imageUrl ? (
                    <img
                      src={post.author.imageUrl}
                      alt={post.author.name}
                      className="h-14 w-14 rounded-2xl"
                    />
                  ) : null}

                  <div>
                    <p className="font-medium text-white">{post.author.name}</p>
                    <p className="text-sm text-zinc-500">{post.author.role}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
                  <p>
                    Published{" "}
                    {post.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </article>
    </main>
  );
}