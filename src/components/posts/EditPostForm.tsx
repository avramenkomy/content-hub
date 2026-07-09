'use client';

import { SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import postImages from '@/data/postImages';

interface Post {
  id: string,
  title: string,
  excerpt: string,
  content: string,
  imageUrl: string | null,
}

type EditPostFormProps = {
  post: Post
}


export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const requestParams = {
      title: String(formData.get('title') || ''),
      excerpt: String(formData.get('excerpt') || ''),
      content: String(formData.get('content') || ''),
      imageUrl: String(formData.get('imageUrl') || ''),
    }

    const res = await fetch(
      `/api/posts/${post.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestParams),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Could not update post.');
      setIsLoading(false);

      return;
    }

    router.push('/dashboard/posts');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-200">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={4}
          defaultValue={post.title}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-zinc-200">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          minLength={10}
          rows={3}
          defaultValue={post.excerpt}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-zinc-200">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          rows={8}
          defaultValue={post.content}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-200">
          Image
        </label>
        <select
          id="imageUrl"
          name="imageUrl"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
          defaultValue={post.imageUrl || "/images/posts/community.svg"}
        >
          {postImages.map(img => (
            <option key={img.value} value={img.value}>
              {img.label}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
        {error}
      </div>}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Saving...' : 'Save and Submit'}
      </button>
    </form>
  )
}
