type PokemonPaginationProps = {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  summary: string;
  onPrevious: () => void;
  onNext: () => void;
};

// Presentational component: renders pagination controls and list summary.
export function PokemonPagination({
  currentPage,
  totalPages,
  isLoading,
  summary,
  onPrevious,
  onNext,
}: PokemonPaginationProps) {
  // Render PokemonPagination for the current state.
  return (
    <footer className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted)] sm:flex-row">
      <p>{summary}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage <= 1 || isLoading}
          className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Anterior
        </button>
        <span className="px-2">
          Pagina {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages || isLoading}
          className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Siguiente
        </button>
      </div>
    </footer>
  );
}
