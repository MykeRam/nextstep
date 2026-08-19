import { FormEvent, useState } from 'react';

import { AppFooter } from '../AppFooter/AppFooter';

type LandingPageProps = {
  isConfigured: boolean;
  onSendMagicLink: (email: string) => Promise<string | null>;
};

const benefits = [
  {
    title: 'Cloud-synced applications',
    description: 'Keep your pipeline with you across devices after a passwordless sign-in.',
  },
  {
    title: 'Follow-up planning',
    description: 'Stay ahead of outreach with list, calendar, and due-date views.',
  },
  {
    title: 'Useful job-search insights',
    description: 'See pipeline health, response rate, offers, and the next best action.',
  },
];

export function LandingPage({ isConfigured, onSendMagicLink }: LandingPageProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const error = await onSendMagicLink(email);
    setMessage(error ?? 'Check your email for a secure sign-in link.');
    setSubmitting(false);
  }

  return (
    <main className="landing-shell">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-intro">
          <p className="landing-brand">NEXTSTEP</p>
          <h1 id="landing-title">A calmer command center for your job search.</h1>
          <p>
            Track every opportunity, follow up at the right time, and keep your job search moving
            forward.
          </p>
        </div>
        <section className="landing-sign-in" aria-labelledby="sign-in-title">
          <h2 id="sign-in-title">Open your demo workspace</h2>
          <p>Enter your email and we’ll send a secure, passwordless sign-in link.</p>
          <form className="landing-auth-form" onSubmit={handleSubmit}>
            <label>
              Email address
              <input
                disabled={!isConfigured || submitting}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>
            <button className="primary-button" disabled={!isConfigured || submitting} type="submit">
              {submitting ? 'Sending…' : 'Send sign-in link'}
            </button>
          </form>
          {message && <p className="landing-auth-message">{message}</p>}
          {!isConfigured && (
            <p className="landing-auth-error">Sign-in is not configured for this deployment yet.</p>
          )}
          <small>New accounts open with a personal copy of the demo applications.</small>
        </section>
      </section>
      <section className="landing-benefits" aria-label="NextStep features">
        {benefits.map((benefit) => (
          <article key={benefit.title}>
            <h2>{benefit.title}</h2>
            <p>{benefit.description}</p>
          </article>
        ))}
      </section>
      <AppFooter />
    </main>
  );
}
