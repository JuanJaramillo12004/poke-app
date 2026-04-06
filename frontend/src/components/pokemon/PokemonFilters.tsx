import type { ChangeEvent } from "react";

type PokemonFiltersProps = {
  searchValue: string;
  typeValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onApply: () => void;
  onClear: () => void;
};

// Presentational component: renders search and type filter controls.
export function PokemonFilters({
  searchValue,
  typeValue,
  onSearchChange,
  onTypeChange,
  onApply,
  onClear,
}: PokemonFiltersProps) {
  // Render PokemonFilters for the current state.
  return (
    <section className="mb-5 grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:grid-cols-[1fr_1fr_auto_auto]">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchValue}
        onChange={onSearchChange}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
      />
      <input
        type="text"
        placeholder="Filtrar por tipo (ej: fire)"
        value={typeValue}
        onChange={onTypeChange}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
      />
      <button
        type="button"
        onClick={onApply}
        className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
      >
        Aplicar
      </button>
      <button
        type="button"
        onClick={onClear}
        className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
      >
        Limpiar
      </button>
    </section>
  );
}
