type StatusPanelProps = {
  isLoading: boolean;
  loadingText: string;
  emptyText: string;
  hasItems: boolean;
};

// Presentational component: shows loading and empty-list states.
export function StatusPanel({
  isLoading,
  loadingText,
  emptyText,
  hasItems,
}: StatusPanelProps) {
  if (isLoading) {
    // Render StatusPanel for the current state.
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
        {loadingText}
      </div>
    );
  }

  if (!hasItems) {
    // Render StatusPanel for the current state.
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
        {emptyText}
      </div>
    );
  }

  return null;
}
