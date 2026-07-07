import type { ReactNode } from 'react';

import { cn } from '@/src/lib/cn';

type CardProps = {
  children: ReactNode,
  className?: string,
}

export default function Card(props: CardProps) {
  const { children, className } = props;

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}