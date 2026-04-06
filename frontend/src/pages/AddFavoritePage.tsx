import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createFavoritePokemon } from "../api/pokemon.api";
import { getApiErrorMessage } from "../api/axios";
import type { CreateFavoritePokemonDto } from "../types/pokemon.types";

type AddFavoriteFormValues = {
  name: string;
  comments: string;
};

export function AddFavoritePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddFavoriteFormValues>({
    defaultValues: {
      name: "",
      comments: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateFavoritePokemonDto = {
      name: values.name,
      comments: values.comments.trim() ? values.comments.trim() : undefined,
    };

    try {
      const favorite = await createFavoritePokemon(payload);
      toast.success("Pokemon agregado a favoritos");
      navigate(`/favorites/${favorite.id}`);
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
            Agregar favorito
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Guarda un pokemon en tu lista personal.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            Nombre del pokemon
            <input
              type="text"
              placeholder="pikachu"
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              {...register("name", { required: "El nombre es obligatorio" })}
            />
            {errors.name && (
              <small className="mt-1 block text-xs font-medium text-[var(--color-primary-strong)]">
                {errors.name.message}
              </small>
            )}
          </label>

          <label className="block text-sm font-medium text-[var(--color-text)]">
            Comentarios (opcional)
            <textarea
              rows={4}
              placeholder="¿Por qué es tu favorito?"
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
              {isSubmitting ? "Guardando..." : "Guardar favorito"}
            </button>
            <Link
              to="/catalog"
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
            >
              Volver al catalogo
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
