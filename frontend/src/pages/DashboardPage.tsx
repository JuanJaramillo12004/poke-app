import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createFavoritePokemon, getCatalogPokemons } from "../api/pokemon.api";
import { getApiErrorMessage } from "../api/axios";
import { useAuth } from "../context/useAuth";
import type {
  CatalogPokemon,
  CatalogPokemonListResponse,
  CatalogPokemonMeta,
  CatalogPokemonQueryParams,
} from "../types/pokemon.types";

const CATALOG_PAGE_LIMIT = 20;
const INITIAL_META: CatalogPokemonMeta = {
  page: 1,
  limit: CATALOG_PAGE_LIMIT,
  total: 0,
  totalPages: 1,
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [catalog, setCatalog] = useState<CatalogPokemon[]>([]);
  const [meta, setMeta] = useState<CatalogPokemonMeta>(INITIAL_META);
  const [isLoading, setIsLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [favoritePokemonIds, setFavoritePokemonIds] = useState<Set<number>>(
    new Set(),
  );

  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [query, setQuery] = useState<CatalogPokemonQueryParams>({
    page: 1,
    limit: CATALOG_PAGE_LIMIT,
  });

  const loadCatalogPage = useCallback(
    async (params: CatalogPokemonQueryParams) => {
      setIsLoading(true);

      try {
        const cleanedParams: CatalogPokemonQueryParams = {
          page: params.page,
          limit: CATALOG_PAGE_LIMIT,
          search: params.search?.trim() ? params.search.trim() : undefined,
          type: params.type?.trim() ? params.type.trim() : undefined,
        };

        const response: CatalogPokemonListResponse =
          await getCatalogPokemons(cleanedParams);

        setCatalog(response.data);
        setMeta(response.meta);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadCatalogPage(query);
  }, [query, loadCatalogPage]);

  const handleApplyFilters = () => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: searchInput,
      type: typeInput,
    }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setTypeInput("");
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: undefined,
      type: undefined,
    }));
  };

  const currentPage = meta.page || query.page || 1;
  const totalPages = Math.max(meta.totalPages || 1, 1);

  const goToPreviousPage = () => {
    if (currentPage <= 1 || isLoading) {
      return;
    }

    setQuery((prev) => ({ ...prev, page: currentPage - 1 }));
  };

  const goToNextPage = () => {
    if (currentPage >= totalPages || isLoading) {
      return;
    }

    setQuery((prev) => ({ ...prev, page: currentPage + 1 }));
  };

  const handleAddToFavorites = async (pokemon: CatalogPokemon) => {
    setAddingId(pokemon.pokemonId);

    try {
      await createFavoritePokemon({
        name: pokemon.name,
      });
      setFavoritePokemonIds((prev) => {
        const next = new Set(prev);
        next.add(pokemon.pokemonId);
        return next;
      });
      toast.success(`${pokemon.name} agregado a favoritos`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-4 h-56 w-56 rounded-full bg-[var(--color-primary-soft)]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-6 h-48 w-48 rounded-full bg-[var(--color-border)]/60 blur-3xl" />

      <section className="relative w-full max-w-5xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-6 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.5)] sm:p-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Pokedex
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
              Catalogo Pokemon
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Hola, {user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
            >
              Limpiar filtros
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
            >
              Cerrar sesion
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          />
          <input
            type="text"
            placeholder="Filtrar por tipo (ej: fire)"
            value={typeInput}
            onChange={(event) => setTypeInput(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          />
          <button
            type="button"
            onClick={handleApplyFilters}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
          >
            Aplicar
          </button>
        </section>

        {isLoading ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
            Cargando catalogo...
          </div>
        ) : catalog.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-muted)]">
            No se encontraron pokemon con esos filtros.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.map((pokemon) => (
              <article
                key={pokemon.pokemonId}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
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
                  onClick={() => void handleAddToFavorites(pokemon)}
                  disabled={
                    addingId === pokemon.pokemonId ||
                    favoritePokemonIds.has(pokemon.pokemonId)
                  }
                  className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {favoritePokemonIds.has(pokemon.pokemonId)
                    ? "En favoritos"
                    : addingId === pokemon.pokemonId
                      ? "Agregando..."
                      : "Agregar a favoritos"}
                </button>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted)] sm:flex-row">
          <p>
            Mostrando {catalog.length} de {meta.total} pokemon
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
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
              onClick={goToNextPage}
              disabled={currentPage >= totalPages || isLoading}
              className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Siguiente
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
