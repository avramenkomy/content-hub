import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/src/lib/cn';

type Variant = 'primary' | 'secondary';

type ButtonProps = {
  href?: string,
  children: ReactNode,
  variant?: Variant,
  className?: string,
}


export default function Button(props: ButtonProps) {
  const { href, children, variant='primary', className } = props;

  const buttonClassName = cn(
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition',
    variant === 'primary' && 'bg-white text-zinc-950 hover:bg-zinc-200',
    variant === 'secondary' && 'border border-zinc-700 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-900',
    className,
  );

  if (!href) {
    return <button className={buttonClassName}>{children}</button>
  }

  // вычисление внешняя сслыка или внутрення
  const isExternal: boolean = href.startsWith('http');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={buttonClassName}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={buttonClassName}>
      {children}
    </Link>
  )
}
