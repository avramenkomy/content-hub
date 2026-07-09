'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type MessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

type MessageStatusActionsPros = {
  messageId: string,
  currentStatus: MessageStatus,
}


export default function AdminMessagePage(props: MessageStatusActionsPros) {
  const { messageId, currentStatus } = props;

  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: MessageStatus) {
    setError('');
    setLoading(true);

    const requestParams = {
      status
    }

    const res = await fetch(`/api/admin/messages/${messageId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestParams),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Could not update message status.');
      setLoading(false);

      return;
    }

    router.refresh();
    setLoading(false);
  }

  function toReadStatus() {
    updateStatus('READ');
  }


  function toArcivedStatus() {
    updateStatus('ARCHIVED');
  }


  function toNewStatus() {
    updateStatus('NEW');
  }


  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {currentStatus !== 'READ' && <button
          type="button"
          onClick={toReadStatus}
          disabled={loading}
          className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zonc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark as read
        </button>}

        {currentStatus !== 'ARCHIVED' && <button
          type="button"
          onClick={toArcivedStatus}
          disabled={loading}
          className="rounded-full border border-yellow-900/70 px-4 py-2 text-sm font-medium text-yellow-200 transition hover:bg-yellow-950/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Arhive
        </button>}

        {currentStatus !== 'NEW' && <button
          type="button"
          onClick={toNewStatus}
          disabled={loading}
          className="rounded-full border border-blue-900/70 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-950/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark as new
        </button>}
      </div>

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  )
}
