import { FormEvent, useState } from 'react';
import { User } from '@supabase/supabase-js';

type AuthPanelProps = {
  isConfigured: boolean;
  loading: boolean;
  onSendMagicLink: (email: string) => Promise<string | null>;
  onSignOut: () => Promise<void>;
  syncError: string;
  syncing: boolean;
  user: User | null;
};

export function AuthPanel({
  isConfigured,
  loading,
  onSendMagicLink,
  onSignOut,
  syncError,
  syncing,
  user,
}: AuthPanelProps) {
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

  if (!isConfigured) {
    return (
      <section className="auth-panel" aria-label="Cloud sync status">
        <p>Cloud sync is being set up. Your applications are currently saved in this browser.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="auth-panel" aria-label="Authentication status">
        <p>Checking your session…</p>
      </section>
    );
  }

  if (user) {
    return (
      <section className="auth-panel auth-panel_signed-in" aria-label="Account status">
        <div>
          <p>Signed in as {user.email}</p>
          <p className={syncError ? 'auth-error' : 'auth-message'}>
            {syncError || (syncing ? 'Syncing applications…' : 'Cloud sync is active.')}
          </p>
        </div>
        <button className="link-button" onClick={onSignOut}>
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="auth-panel" aria-labelledby="auth-title">
      <div>
        <h2 id="auth-title">Sync your applications</h2>
        <p>Sign in with email to access your applications across devices.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? 'Sending…' : 'Send sign-in link'}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
    </section>
  );
}
