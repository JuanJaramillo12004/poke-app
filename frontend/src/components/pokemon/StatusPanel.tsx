type StatusPanelProps = {
  isLoading: boolean;
  loadingText: string;
  emptyText: string;
  hasItems: boolean;
};

export function StatusPanel({
  isLoading,
  loadingText,
  emptyText,
  hasItems,
}: StatusPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
        {loadingText}
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
        {emptyText}
      </div>
    );
  }

  return null;
}
