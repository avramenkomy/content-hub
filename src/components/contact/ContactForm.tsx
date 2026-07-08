'use client';

import { FormEvent, useState } from 'react';

export default function ContactForm() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const requestParams = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestParams),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Could not send message.');
      setIsLoading(false);

      return;
    }

    setSuccessMessage(data.message || 'Message sent successfully.');
    form.reset();
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-zinc-200">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          minLength={4}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-200">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={7}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
          placeholder="Write your message"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-green-900/60 bg-green-950/40 px-4 py-3 text-sm text-green-200">
          {successMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Sending..." : "Send message"}
      </button>
    </form>
  )
}
