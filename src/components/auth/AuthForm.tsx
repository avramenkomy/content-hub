"use client"

import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';
import Link from 'next/link';

type AuthFormProps = {
  mode: 'login' | 'register';
}


export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    interface Payload {
      name?: string,
      email: string,
      password: string,
    }

    const requestParams: Payload = {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    }

    if (isRegister) {
      requestParams.name = String(formData.get('name') || '');
    }

    const response = await fetch(
      `/api/auth/${mode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestParams),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Something wrong');
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isRegister
        ? (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
                placeholder="Your Name"
              />
            </div>
          )
        : null
      }

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-200"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="text"
          required
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
          placeholder="Your Email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-200"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
          placeholder="At least 8 characters"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-zinc-500">
        {isRegister ? 'Already have an account?' : 'No account yet?'}{' '}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-medium text-white hover:text-zinc-300"
        >
          {isRegister ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </form>
  )
}