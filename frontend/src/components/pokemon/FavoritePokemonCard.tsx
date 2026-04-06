import { useCallback } from "react";
import { Link } from "react-router-dom";
import type { FavoritePokemon } from "../../types/pokemon.types";

function DetailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type FavoritePokemonCardProps = {
  favorite: FavoritePokemon;
  deletingFavoriteId: number | null;
  onDelete: (favoriteId: number) => void;
};

export function FavoritePokemonCard({
  favorite,
  deletingFavoriteId,
  onDelete,
}: FavoritePokemonCardProps) {
  const handleDeleteClick = useCallback(() => {
    onDelete(favorite.id);
  }, [onDelete, favorite.id]);

  const isDeleting = deletingFavoriteId === favorite.id;

  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-base font-semibold text-[var(--color-text)]">
          {favorite.name}
        </p>
        <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
          #{favorite.pokemonId}
        </span>
      </div>

      {favorite.imageUrl ? (
        <div className="mb-3 grid place-items-center rounded-xl bg-[var(--color-bg)] py-2">
          <img
            src={favorite.imageUrl}
            alt={favorite.name}
            className="h-20 w-20 object-contain"
          />
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap gap-1.5">
        {favorite.types.map((type) => (
          <span
            key={`${favorite.id}-${type}`}
            className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary-strong)]"
          >
            {type}
          </span>
        ))}
      </div>

      <p className="mb-4 line-clamp-2 text-sm text-[var(--color-muted)]">
        {favorite.comments?.trim() || "Sin comentarios"}
      </p>

      <div className="flex items-center justify-end gap-2">
        <Link
          to={`/favorites/${favorite.id}`}
          title="Ver detalle"
          aria-label="Ver detalle"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
        >
          <DetailIcon />
        </Link>
        <Link
          to={`/favorites/${favorite.id}/edit`}
          title="Editar"
          aria-label="Editar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
        >
          <EditIcon />
        </Link>
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          title="Eliminar"
          aria-label="Eliminar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          ) : (
            <DeleteIcon />
          )}
        </button>
      </div>
    </article>
  );
}
