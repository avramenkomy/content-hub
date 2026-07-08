import { redirect, RedirectType } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  return (
    <main className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Dashboard
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Welcome, {user.name}
            </h1>

            <p className="">
              This page is protected by a server-side session check.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <p className="text-sm text-zinc-500">Name</p>
            <p className="mt-2 font-medium text-white">{user.name}</p>
          </Card>

          <Card>
            <p className="text-sm text-zinc-500">Email</p>
            <p className="mt-2 font-medium text-white">{user.email}</p>
          </Card>

          <Card>
            <p className="text-sm text-zinc-500">Role</p>
            <p className="mt-2 font-medium text-white">{user.role}</p>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card>
            <h2 className="text-lg font-semibold text-white">User area</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Here users will create and manage their own posts.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">Moderation</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Moderators will review pending posts and approve or reject them.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">Admin</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Admins will manage users, roles and platform content.
            </p>
          </Card>
        </div>
      </Container>
    </main>
  )
}