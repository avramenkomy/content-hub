import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import EditPostForm from "@/components/posts/EditPostForm";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import prisma from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await requireCurrentUser();
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      authorId: true,
    },
  });

  if (!post) {
    notFound();
  }

  if (post.authorId !== user.id) {
    redirect("/dashboard/posts");
  }

  return (
    <main className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Link
            href="/dashboard/posts"
            className="text-sm font-medium text-zinc-400 hover:text-white"
          >
            ← Back to my posts
          </Link>

          <div className="mt-8 mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Edit post
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Update your submission
            </h1>

            <p className="mt-4 text-zinc-400">
              After editing, the post will be sent to moderation again.
            </p>
          </div>

          <Card>
            <EditPostForm post={post} />
          </Card>
        </div>
      </Container>
    </main>
  );
}
