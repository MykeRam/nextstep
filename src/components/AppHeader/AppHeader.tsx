type AppHeaderProps = {
  applicationCount: number;
};

export function AppHeader({ applicationCount }: AppHeaderProps) {
  return (
    <header>
      <div>
        <h1>NextStep</h1>
        <p className="subtitle">Keep your opportunities and next moves in one place.</p>
      </div>
      <div className="summary">
        <strong>{applicationCount}</strong>
        <span>applications</span>
      </div>
    </header>
  );
}
