import Link from 'next/link';
import MessageStatusActions from '@/components/admin/MessageStatusActions';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';


function getStatusClassName(status: string): string {
  let className = '';

  switch (status) {
    case 'NEW':
      className = 'border-blue-900/70 bg-blue-900/30 text-blue-200';
      break;

    case 'READ':
      className = 'border-green-900/70 bg-green-950/30 text-green-200';
      break;

    default: className = 'border-zinc-700 bg-zinc-900 text-zinc-300';
  }

  return className;
}


export default async function AdminMessagePage() {
  await requireRole(['ADMIN']);

  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    }
  });

  const newsMsgCount = messages.filter(msg => msg.status === 'NEW').length;
  const readMsgCount = messages.filter(msg => msg.status === 'READ').length;
  const archMsgCount = messages.filter(msg => msg.status === 'ARCHIVED').length;

  return (
    <main className="py-16 sm:py-20">
      <Container>
        <Link
          href="/admin"
          className="text-sm font-medium text-zinc-400 hover:text-white"
        >
          &larr; Back to admin
        </Link>

        <div className="mt-8 mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Admin messages
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Contact messages
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Messages submitted through the contact form are saved in PostgreSQL
            and can be reviewed by administrators.
          </p>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <Card>
            <p className="text-sm text-zinc-500">New</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {newsMsgCount}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Read</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {readMsgCount}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Archived</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {archMsgCount}
            </p>
          </Card>
        </div>

        {messages.length > 0
          ? <div className="space-y-6">
              {messages.map(msg => (
                <Card key={msg.id}>
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`
                          rounded-full border px-3 py-1 text-xs font-medium ${getStatusClassName(msg.status)}
                        `}>
                          {msg.status}
                        </span>

                        <time
                          dateTime={msg.createdAt.toISOString()}
                          className="text-sm text-zinc-500"
                        >
                          {msg.createdAt.toLocaleDateString('ru-Ru', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>

                      <h2 className="mt-4 text-2xl font-semibold text-white">
                        {msg.subject}
                      </h2>

                      <div className="mt-4 text-sm text-zinc-500">
                        <p>Name: {msg.name}</p>
                        <p>Email: {msg.email}</p>
                      </div>

                      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-300">
                        {msg.message}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <MessageStatusActions
                        messageId={msg.id}
                        currentStatus={msg.status}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          : <Card>
              <p className="text-zinc-400">No contact message yet.</p>
            </Card>
        }
      </Container>
    </main>
  )
}
