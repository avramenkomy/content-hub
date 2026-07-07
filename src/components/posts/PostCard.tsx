import Link from 'next/link';
import Card from '@/components/ui/Card';

interface Author {
  name: string
}

type PostCardProps = {
  post: {
    title: string,
    slug: string,
    excerpt: string,
    imageUrl: string | null,
    author: Author,
    // author: { name: string },
    createdAt: Date,
  },
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-56 w-full object-cover"
        />
      ) : null}

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span>{post.author.name}</span>
          <span>&bull;</span>
          <time dateTime={post.createdAt.toISOString()}>
            {post.createdAt.toLocaleDateString("ru-Ru", {
              year: 'numeric',
              month: "short",
              day: "numeric"
            })}
          </time>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-white">
          <Link
            href={`/posts/${post.slug}`}
            className="hover:text-zinc-300"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {post.excerpt}
        </p>

        <Link
          href={`/posts/${post.slug}`}
          className="mt-5 inline-flex text-sm font-medium text-white hover:text-zinc-300"
        >
            Read more
        </Link>
      </div>
    </Card>
  )
}
