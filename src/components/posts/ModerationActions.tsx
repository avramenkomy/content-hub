'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ModerationActionsProps = {
  postId: string,
}


export default function ModerationActions({ postId }: ModerationActionsProps) {
  const router = useRouter();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function approvePost() {
    setError('');
    setIsLoading(true);

    const res = await fetch(
      `/api/moderation/posts/${postId}/approve`,
      { method: 'POST' }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Could not approve post');
      setIsLoading(false);

      return;
    }

    router.refresh();
  }


  async function rejectPost() {
    const reason = window.prompt('Enter the reason for post reject');

    setError('');
    setIsLoading(true);

    const res = await fetch(`/api/moderation/posts/${postId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Could not reject post.');
      setIsLoading(false);

      return;
    }

    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={approvePost}
          disabled={isLoading}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Please wait...' : 'Approve'}
        </button>

        <button
          type="button"
          onClick={rejectPost}
          disabled={isLoading}
          className="rounded-full border border-red-900/70 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reject
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-300">
        {error}
      </p>}
    </div>
  )
}
