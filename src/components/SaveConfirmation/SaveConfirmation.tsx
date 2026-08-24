type SaveConfirmationProps = {
  message: string;
};

export function SaveConfirmation({ message }: SaveConfirmationProps) {
  return (
    <div aria-live="polite" className="save-confirmation" role="status">
      <span aria-hidden="true">✓</span>
      {message}
    </div>
  );
}
