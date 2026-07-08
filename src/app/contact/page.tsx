import ContactForm from "@/components/contact/ContactForm";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

export default function ContactPage() {
  return (
    <main className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Contact
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Send a message to the platform owner.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              This form demonstrates backend validation, database persistence and
              SMTP email sending through a server-side API route.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Card>
                <h2 className="text-lg font-semibold text-white">
                  Saved in database
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Every message is stored as a ContactMessage record in PostgreSQL.
                </p>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-white">
                  Email delivery
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  In production, the same request can send email through any SMTP
                  provider configured in environment variables.
                </p>
              </Card>
            </div>
          </div>

          <Card>
            <ContactForm />
          </Card>
        </div>
      </Container>
    </main>
  );
}