import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../api/axios";
import { deleteFavoritePokemon, getFavoritePokemons } from "../api/pokemon.api";
import type {
  FavoritePokemon,
  FavoritePokemonListResponse,
  FavoritePokemonMeta,
  FavoritePokemonQueryParams,
} from "../types/pokemon.types";

const FAVORITES_PAGE_LIMIT = 20;
const INITIAL_META: FavoritePokemonMeta = {
  page: 1,
  limit: FAVORITES_PAGE_LIMIT,
  total: 0,
  totalPages: 1,
};

// Custom hook: manages favorite Pokemon list state, filters, pagination, and deletion.
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [meta, setMeta] = useState<FavoritePokemonMeta>(INITIAL_META);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingFavoriteId, setDeletingFavoriteId] = useState<number | null>(
    null,
  );

  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [query, setQuery] = useState<FavoritePokemonQueryParams>({
    page: 1,
    limit: FAVORITES_PAGE_LIMIT,
  });

  // Function to load a page of the favorite Pokemon with the given query parameters.
  const loadFavorites = useCallback(
    async (params: FavoritePokemonQueryParams) => {
      setIsLoading(true);

      // Surface request failures to the user with clear feedback.
      try {
        const cleanedParams: FavoritePokemonQueryParams = {
          page: params.page,
          limit: FAVORITES_PAGE_LIMIT,
          search: params.search?.trim() ? params.search.trim() : undefined,
          type: params.type?.trim() ? params.type.trim() : undefined,
        };

        const response: FavoritePokemonListResponse =
          await getFavoritePokemons(cleanedParams);

        setFavorites(response.data);
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
    void loadFavorites(query);
  }, [query, loadFavorites]);

  // Event handler for search filter input change.
  const onSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  // Event handler for type filter input change.
  const onTypeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTypeInput(event.target.value);
  }, []);

  // Applies current filter inputs to the query parameters, resetting to the first page.
  const applyFilters = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: searchInput,
      type: typeInput,
    }));
  }, [searchInput, typeInput]);

  // Clears filter inputs and resets query parameters to default values.
  const clearFilters = useCallback(() => {
    setSearchInput("");
    setTypeInput("");
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: undefined,
      type: undefined,
    }));
  }, []);

  // Pagination logic: calculates current and total pages, and provides navigation handlers.
  const currentPage = meta.page || query.page || 1;
  const totalPages = Math.max(meta.totalPages || 1, 1);

  // Handler to navigate to the previous page, with guards against invalid navigation.
  const goToPreviousPage = useCallback(() => {
    if (currentPage <= 1 || isLoading) {
      return;
    }

    setQuery((prev) => ({ ...prev, page: currentPage - 1 }));
  }, [currentPage, isLoading]);

  // Handler to navigate to the next page, with guards against invalid navigation.
  const goToNextPage = useCallback(() => {
    if (currentPage >= totalPages || isLoading) {
      return;
    }

    setQuery((prev) => ({ ...prev, page: currentPage + 1 }));
  }, [currentPage, totalPages, isLoading]);

  // Handler to delete a favorite Pokemon, with loading state and error handling.
  const deleteFavorite = useCallback(
    async (favoriteId: number) => {
      setDeletingFavoriteId(favoriteId);

      // Surface request failures to the user with clear feedback.
      try {
        await deleteFavoritePokemon(favoriteId);
        toast.success("Favorito eliminado");

        const shouldGoPreviousPage =
          favorites.length === 1 && (query.page ?? 1) > 1;

        setQuery((prev) => ({
          ...prev,
          page: shouldGoPreviousPage ? (prev.page ?? 1) - 1 : prev.page,
        }));

        if (!shouldGoPreviousPage) {
          await loadFavorites(query);
        }
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setDeletingFavoriteId(null);
      }
    },
    [favorites.length, query, loadFavorites],
  );

  return useMemo(
    () => ({
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
    }),
    [
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
    ],
  );
}
