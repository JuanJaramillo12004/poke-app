import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "../api/axios";
import {
  deleteFavoritePokemon,
  getFavoritePokemonById,
} from "../api/pokemon.api";
import type { FavoritePokemon } from "../types/pokemon.types";

export function FavoriteDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const favoriteId = Number(params.id);

  const [favorite, setFavorite] = useState<FavoritePokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadFavorite() {
      if (!Number.isInteger(favoriteId) || favoriteId <= 0) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getFavoritePokemonById(favoriteId);
        setFavorite(response);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadFavorite();
  }, [favoriteId]);

  if (!Number.isInteger(favoriteId) || favoriteId <= 0) {
    return <Navigate to="/" replace />;
  }

  const handleDelete = async () => {
    if (!favorite) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteFavoritePokemon(favorite.id);
      toast.success("Favorito eliminado");
      navigate("/");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-4 h-56 w-56 rounded-full bg-[var(--color-primary-soft)]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-6 h-48 w-48 rounded-full bg-[var(--color-border)]/60 blur-3xl" />

      <section className="relative w-full max-w-3xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-6 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.5)] sm:p-8">
        <header className="mb-6 border-b border-[var(--color-border)] pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Pokedex
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Detalle de favorito
          </h1>
        </header>

        {isLoading ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
            Cargando detalle...
          </div>
        ) : !favorite ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
            No se encontro el favorito.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="grid h-28 w-28 place-items-center rounded-2xl bg-[var(--color-bg)]">
                <img
                  src={favorite.imageUrl}
                  alt={favorite.name}
                  className="h-24 w-24 object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--color-text)]">
                  {favorite.name}
                </h2>
                <p className="text-sm text-[var(--color-muted)]">
                  Pokemon #{favorite.pokemonId}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {favorite.types.map((type) => (
                    <span
                      key={`${favorite.id}-${type}`}
                      className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary-strong)]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {(() => {
              const stats = Object.entries(favorite.baseStats || {}).sort(
                ([a], [b]) => a.localeCompare(b),
              );

              return (
                <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                    Stats base
                  </p>

                  {stats.length === 0 ? (
                    <p className="text-sm text-[var(--color-muted)]">
                      No hay stats disponibles.
                    </p>
                  ) : (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {stats.map(([statName, value]) => (
                        <li
                          key={statName}
                          className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                        >
                          <span className="text-[var(--color-muted)]">
                            {statName}
                          </span>
                          <span className="font-semibold text-[var(--color-text)]">
                            {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })()}

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <p className="mb-1 text-sm font-semibold text-[var(--color-text)]">
                Comentarios
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {favorite.comments?.trim() || "Sin comentarios"}
              </p>
            </section>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to={`/favorites/${favorite.id}/edit`}
                className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
              >
                Editar comentario
              </Link>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Eliminando..." : "Eliminar favorito"}
              </button>
              <Link
                to="/"
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
              >
                Volver a favoritos
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
