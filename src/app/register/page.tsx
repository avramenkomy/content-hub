import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return(
    <main className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Create account
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
              Register
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              New users are created with the USER role by default.
            </p>
          </div>

          <Card>
            <AuthForm mode="register" />
          </Card>
        </div>
      </Container>
    </main>
  )
}