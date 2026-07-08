import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) redirect('/dashboard');

  return (
    <main className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Authentication
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
              Sign In
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Use one pf seeded demo accounts or your registered account.
            </p>
          </div>

          <Card>
            <AuthForm mode="login" />
          </Card>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-400">
            <p className="font-medium text-white">Demo accounts</p>

            <div className="mt-3 space-y-1">
              <p>admin@example.com / password123</p>
              <p>moderator@example.com / password123</p>
              <p>user@example.com / password123</p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}