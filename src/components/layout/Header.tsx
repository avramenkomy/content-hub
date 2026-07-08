import Link from 'next/link';
import navigation from '@/data/navigation';
import Container from '../ui/Container';


export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-zinc-500 bg-zinc-950/80 backdrop-blur"
    >
      <Container
        className="flex h-16 items-center justify-between"
      >
        <Link href="/" className="text-sm font-semibold tracking-wide text-white">
          Content Hub
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Register
          </Link>
        </div>
      </Container>
    </header>
  )
}
