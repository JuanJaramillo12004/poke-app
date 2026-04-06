import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { FavoritePokemonCard } from "../components/pokemon/FavoritePokemonCard";
import { PokemonFilters } from "../components/pokemon/PokemonFilters";
import { PokemonPagination } from "../components/pokemon/PokemonPagination";
import { StatusPanel } from "../components/pokemon/StatusPanel";
import { useFavorites } from "../hooks/useFavorites";

// Page component: handles screen-level layout, actions, and data flow.
export function DashboardPage() {
  const { logout } = useAuth();
  const {
    favorites,
    meta,
    isLoading,
    deletingFavoriteId,
    searchInput,
    typeInput,
    currentPage,
    totalPages,
    onSearchChange,
    onTypeChange,
    applyFilters,
    clearFilters,
    goToPreviousPage,
    goToNextPage,
    deleteFavorite,
  } = useFavorites();

  const handleDeleteFavorite = useCallback(
    (favoriteId: number) => {
      void deleteFavorite(favoriteId);
    },
    [deleteFavorite],
  );

  // Render DashboardPage for the current state.
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
              Mis favoritos
            </h1>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap sm:justify-end">
            <Link
              to="/favorites/new"
              className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] sm:w-auto"
            >
              Nuevo favorito
            </Link>
            <Link
              to="/catalog"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] sm:w-auto"
            >
              Ver catalogo
            </Link>
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] sm:w-auto"
            >
              Limpiar filtros
            </button>
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] sm:w-auto"
            >
              Cerrar sesion
            </button>
          </div>
        </header>

        <PokemonFilters
          searchValue={searchInput}
          typeValue={typeInput}
          onSearchChange={onSearchChange}
          onTypeChange={onTypeChange}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        {!isLoading && favorites.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <FavoritePokemonCard
                key={favorite.id}
                favorite={favorite}
                deletingFavoriteId={deletingFavoriteId}
                onDelete={handleDeleteFavorite}
              />
            ))}
          </div>
        ) : null}

        <StatusPanel
          isLoading={isLoading}
          hasItems={favorites.length > 0}
          loadingText="Cargando favoritos..."
          emptyText="No tienes favoritos para mostrar."
        />

        <PokemonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          summary={`Mostrando ${favorites.length} de ${meta.total} favoritos`}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      </section>
    </main>
  );
}
