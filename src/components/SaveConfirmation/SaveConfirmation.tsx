type SaveConfirmationProps = {
  exiting: boolean;
  message: string;
};

export function SaveConfirmation({ exiting, message }: SaveConfirmationProps) {
  return (
    <div
      aria-live="polite"
      className={`save-confirmation${exiting ? ' save-confirmation_exiting' : ''}`}
      role="status"
    >
      <span aria-hidden="true">✓</span>
      {message}
    </div>
  );
}
