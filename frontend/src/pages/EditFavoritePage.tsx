import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "../api/axios";
import {
  getFavoritePokemonById,
  updateFavoritePokemon,
} from "../api/pokemon.api";
import type { FavoritePokemon } from "../types/pokemon.types";

type EditFavoriteFormValues = {
  comments: string;
};

export function EditFavoritePage() {
  const params = useParams();
  const navigate = useNavigate();
  const favoriteId = Number(params.id);

  const [favorite, setFavorite] = useState<FavoritePokemon | null>(null);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<EditFavoriteFormValues>({
    defaultValues: {
      comments: "",
    },
  });

  useEffect(() => {
    async function loadFavorite() {
      if (!Number.isInteger(favoriteId) || favoriteId <= 0) {
        setIsLoadingFavorite(false);
        return;
      }

      try {
        const response = await getFavoritePokemonById(favoriteId);
        setFavorite(response);
        setValue("comments", response.comments ?? "");
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoadingFavorite(false);
      }
    }

    void loadFavorite();
  }, [favoriteId, setValue]);

  if (!Number.isInteger(favoriteId) || favoriteId <= 0) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateFavoritePokemon(favoriteId, {
        comments: values.comments.trim() || undefined,
      });
      toast.success("Comentario actualizado");
      navigate(`/favorites/${favoriteId}`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-4 h-56 w-56 rounded-full bg-[var(--color-primary-soft)]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-6 h-48 w-48 rounded-full bg-[var(--color-border)]/60 blur-3xl" />

      <section className="relative w-full max-w-2xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-6 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.5)] sm:p-8">
        <header className="mb-6 border-b border-[var(--color-border)] pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Pokedex
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Editar comentario
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {favorite ? `Pokemon: ${favorite.name}` : "Cargando favorito..."}
          </p>
        </header>

        {isLoadingFavorite ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
            Cargando favorito...
          </div>
        ) : !favorite ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
            No se pudo cargar el favorito.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-[var(--color-text)]">
              Comentarios
              <textarea
                rows={5}
                placeholder="Actualiza tus notas..."
                className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                {...register("comments")}
              />
            </label>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
              <Link
                to={`/favorites/${favoriteId}`}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
