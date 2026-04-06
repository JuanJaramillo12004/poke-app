import { useCallback } from "react";
import type { CatalogPokemon } from "../../types/pokemon.types";

type CatalogPokemonCardProps = {
  pokemon: CatalogPokemon;
  addingId: number | null;
  favoritePokemonIds: Set<number>;
  onAdd: (pokemon: CatalogPokemon) => void;
};

// Card component: renders catalog Pokemon info and add-to-favorites action.
export function CatalogPokemonCard({
  pokemon,
  addingId,
  favoritePokemonIds,
  onAdd,
}: CatalogPokemonCardProps) {
  const handleAddClick = useCallback(() => {
    onAdd(pokemon);
  }, [onAdd, pokemon]);

  const isAdding = addingId === pokemon.pokemonId;
  const isInFavorites = favoritePokemonIds.has(pokemon.pokemonId);

  // Render CatalogPokemonCard for the current state.
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-base font-semibold text-[var(--color-text)]">
          {pokemon.name}
        </p>
        <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
          #{pokemon.pokemonId}
        </span>
      </div>

      {pokemon.imageUrl ? (
        <div className="mb-3 grid place-items-center rounded-xl bg-[var(--color-bg)] py-2">
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="h-20 w-20 object-contain"
          />
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap gap-1.5">
        {pokemon.types.map((type) => (
          <span
            key={`${pokemon.pokemonId}-${type}`}
            className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary-strong)]"
          >
            {type}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddClick}
        disabled={isAdding || isInFavorites}
        className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isInFavorites
          ? "En favoritos"
          : isAdding
            ? "Agregando..."
            : "Agregar a favoritos"}
      </button>
    </article>
  );
}
