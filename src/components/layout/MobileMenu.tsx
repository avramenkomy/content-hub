'use client';

import Link from 'next/link';
import { useState } from 'react';
import LogoutButton from '../auth/LogoutButton';
import type { AppRole, NavItem } from '@/data/navigation';

type MobileMenuProps = {
  navigation: NavItem[],
  user: {
    name: string,
    role: AppRole,
  } | null,
}

export default function MobileMenu(props: MobileMenuProps) {
  const { navigation, user } = props;

  const [open, setOpen] = useState(false);


  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(prevState => !prevState)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
      >
        {open ? 'Close' : 'Menu'}
      </button>

      {open
        ?  <div
            id="mobile-menu"
            className="absolute left-0 right-0 top-16 border-b border-zinc-800 bg-zinc-950 px-4 py-5 shadow-2xl"
          >
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 border-t border-zinc-800 pt-5">
              {user ? (
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block rounded-xl bg-zinc-900 px-4 py-3"
                  >
                    <span className="block text-sm font-medium text-white">
                      {user.name}
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500">
                      {user.role}
                    </span>
                  </Link>

                  <LogoutButton compact className="w-full justify-center" />
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-full border border-zinc-700 px-4 py-3 text-center text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        : null
      }
    </div>
  )
}