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

  const loadFavorites = useCallback(
    async (params: FavoritePokemonQueryParams) => {
      setIsLoading(true);

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

  const onSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  const onTypeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTypeInput(event.target.value);
  }, []);

  const applyFilters = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: searchInput,
      type: typeInput,
    }));
  }, [searchInput, typeInput]);

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

  const currentPage = meta.page || query.page || 1;
  const totalPages = Math.max(meta.totalPages || 1, 1);

  const goToPreviousPage = useCallback(() => {
    if (currentPage <= 1 || isLoading) {
      return;
    }

    setQuery((prev) => ({ ...prev, page: currentPage - 1 }));
  }, [currentPage, isLoading]);

  const goToNextPage = useCallback(() => {
    if (currentPage >= totalPages || isLoading) {
      return;
    }

    setQuery((prev) => ({ ...prev, page: currentPage + 1 }));
  }, [currentPage, totalPages, isLoading]);

  const deleteFavorite = useCallback(
    async (favoriteId: number) => {
      setDeletingFavoriteId(favoriteId);

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
