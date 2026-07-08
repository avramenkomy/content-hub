import Link from 'next/link';
import CreatePostForm from '@/components/posts/CreatePostForm';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import { requireCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  await requireCurrentUser();

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
              New post
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Submit content for review
            </h1>

            <p className="mt-4 text-zinc-400">
              New posts are created with the PENDING status and must be approved
              by a moderator before becoming public.
            </p>
          </div>

          <Card>
            <CreatePostForm />
          </Card>
        </div>
      </Container>
    </main>
  );
}
