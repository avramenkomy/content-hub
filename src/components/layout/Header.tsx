import Link from 'next/link';

import Container from '@/components/ui/Container';
import LogoutButton from '@/components/auth/LogoutButton';
import MobileMenu from './MobileMenu';

import navigation, { AppRole } from '@/data/navigation';

import { getCurrentUser } from '@/lib/auth';



export default async function Header() {
  const user = await getCurrentUser();

  const visiblenavigation = navigation.filter(item => {
    if (item.authOnly && !user) {
      return false;
    }

    if (item.roles && user && !item.roles.includes(user.role)) {
      return false;
    }

    if (item.roles && !user) {
      return false;
    }

    return true;
  });

  const mobileUser = user
    ? {
        name: user.name,
        role: user.role as AppRole
      }
    : null

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur"
    >
      <Container
        className="relative flex h-16 items-center justify-between gap-6"
      >
        <Link href="/" className="shrink-0 text-sm font-semibold tracking-wide text-white">
          Content Hub
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {visiblenavigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">

          {user
            ? <>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 transition hover:text-white"
                >
                  {user.name}
                </Link>

                <span className="hidden rounded-full border border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 lg:inline">
                  {user.role}
                </span>

                <LogoutButton compact />
              </>
            : <>
                <Link
                  href="/login"
                  className="text-sm text-zinc-400 transition hover:text-white"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
                >
                  Register
                </Link>
              </>
          }
        </div>

        <MobileMenu navigation={visiblenavigation} user={mobileUser} />
      </Container>
    </header>
  )
}
