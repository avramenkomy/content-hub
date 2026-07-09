'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/cn';

type LogoutButtonProps = {
  compact?: boolean;
  className?: string;
};

export default function LogoutButton(props: LogoutButtonProps) {
  const { compact=false, className } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        "rounded-full border border-zinc-700 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60",
        compact ? "px-3 py-2" : "px-5 py-3",
        className
      )}
    >
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}