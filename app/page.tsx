import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';

interface FeatureItem {
  title: string,
  description: string,
}

const features: FeatureItem[] = [
  {
    title: 'Authentication',
    description: 'Email and password authentication with secure server-side logic.',
  },

  {
    title: 'Role-based access',
    description: 'Separate permissions for users, moderators and administrators.'
  },

  {
    title: 'Moderation workflow',
    description: 'Users submit content, moderators review it, approved posts go public.'
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-zinc-800 py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className=" mb-4 text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                Full-Stack Next.js application
              </p>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Content platform with auth, roles and moderation.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                Content Hub is a production-oriented full-stack project built to
                demonstrate frontend, backend, database, authentication, email and
                deployment skills.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/posts">View Posts</Button>
                <Button href="/dashboard" variant="secondary">
                  Open dashboard
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl">
              <img
                src="/images/content-preview.svg"
                alt="Content Hub application preview"
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Core Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
              Built as a real full-stack project
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map(feat => (
              <Card key={feat.title}>
                <h3 className="text-lg font-semibold text-white">
                  {feat.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">{feat.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}