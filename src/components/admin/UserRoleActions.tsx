'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Role = 'USER' | 'MODERATOR' | 'ADMIN';

type UserRoleActionsProps = {
  userId: string,
  currentRole: Role,
  disabled?: boolean,
}

const roles: Role[] = ['USER', 'MODERATOR', 'ADMIN'];

export default function UserRoleActions(props: UserRoleActionsProps) {
  const { userId, currentRole, disabled=false } = props;

  const router = useRouter();

  const [role, setRole] = useState<Role>(currentRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function updateRole() {
    setError('');

    if (role === currentRole) {
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Could not update user role yet.');
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <select
          value={role}
          onChange={event => setRole(event.target.value as Role)}
          disabled={disabled || loading}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {roles.map(roleItem => (
            <option key={roleItem} value={roleItem}>
              {roleItem}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={updateRole}
          disabled={disabled || loading || role === currentRole}
          className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {disabled && <p className="text-xs text-zinc-500">You cannot change your own role.</p>}

      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  )
}
