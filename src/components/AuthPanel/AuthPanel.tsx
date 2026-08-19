import { FormEvent, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

type AuthPanelProps = {
  isConfigured: boolean;
  loading: boolean;
  onSendMagicLink: (email: string) => Promise<string | null>;
  onSignOut: () => Promise<void>;
  shouldAnimate: boolean;
  syncError: string;
  syncing: boolean;
  user: User | null;
};

export function AuthPanel({
  isConfigured,
  loading,
  onSendMagicLink,
  onSignOut,
  shouldAnimate,
  syncError,
  syncing,
  user,
}: AuthPanelProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [typedEmail, setTypedEmail] = useState('');
  const [showSyncStatus, setShowSyncStatus] = useState(!shouldAnimate);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!user) return;

    if (!shouldAnimate || prefersReducedMotion) {
      setTypedEmail(user.email ?? '');
      setShowSyncStatus(true);
      return;
    }

    const email = user.email ?? '';
    let characterIndex = 0;
    let typingInterval: number | undefined;
    let typingStartTimeout: number | undefined;
    let syncStatusTimeout: number | undefined;
    setTypedEmail('');
    setShowSyncStatus(false);

    if (!email) {
      setShowSyncStatus(true);
      return;
    }

    typingStartTimeout = window.setTimeout(() => {
      typingInterval = window.setInterval(() => {
        characterIndex += 1;
        setTypedEmail(email.slice(0, characterIndex));

        if (characterIndex === email.length) {
          window.clearInterval(typingInterval);
          syncStatusTimeout = window.setTimeout(() => setShowSyncStatus(true), 180);
        }
      }, 30);
    }, 1320);

    return () => {
      if (typingStartTimeout) window.clearTimeout(typingStartTimeout);
      if (typingInterval) window.clearInterval(typingInterval);
      if (syncStatusTimeout) window.clearTimeout(syncStatusTimeout);
    };
  }, [prefersReducedMotion, shouldAnimate, user]);

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
    const statusMessage =
      syncError || (syncing ? 'Syncing applications…' : 'Cloud sync is active.');
    const shouldShine = showSyncStatus && !syncError && !syncing;

    return (
      <section className="auth-panel auth-panel_signed-in" aria-label="Account status">
        <div>
          <p aria-label={`Signed in as ${user.email}`}>
            <span aria-hidden="true">Signed in as {typedEmail}</span>
          </p>
          <p
            aria-hidden={!showSyncStatus}
            className={`${syncError ? 'auth-error' : 'auth-message'}${shouldShine ? ' auth-message_shine' : ''}${showSyncStatus ? '' : ' auth-message_placeholder'}`}
          >
            {showSyncStatus ? statusMessage : 'Cloud sync is active.'}
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
