'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeletePostButtonProps = {
  postId: string
}


export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirm = window.confirm('A you sure you want to delete this post?');

    if (!confirm) return;

    setError('');
    setLoading(true);

    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Could not delete post.');
      setLoading(false);

      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-full border border-red-900/70 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  )
}
