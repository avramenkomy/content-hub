import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Header from '@/components/layout/Header';
import site from '@/data/site';

import './globals.css';


export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

type RootLayoutProps = {
  children: ReactNode,
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Header />
        
        {children}
      </body>
    </html>
  );
}
