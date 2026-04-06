import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../api/axios";
import { createFavoritePokemon, getCatalogPokemons } from "../api/pokemon.api";
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

// Custom hook: manages catalog list state, filters, pagination, and add-to-favorites.
export function useCatalog() {
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

  // Function to load a page of the catalog with the given query parameters.
  const loadCatalogPage = useCallback(
    async (params: CatalogPokemonQueryParams) => {
      setIsLoading(true);

      // Surface request failures to the user with clear feedback.
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

  // Event handlers: update local state and trigger side effects as needed.
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

  // Handler to add a Pokemon to favorites, with loading state and error handling.
  const addToFavorites = useCallback(async (pokemon: CatalogPokemon) => {
    setAddingId(pokemon.pokemonId);

    // Surface request failures to the user with clear feedback.
    try {
      await createFavoritePokemon({ name: pokemon.name });
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
  }, []);

  return useMemo(
    () => ({
      catalog,
      meta,
      isLoading,
      addingId,
      favoritePokemonIds,
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
      addToFavorites,
    }),
    [
      catalog,
      meta,
      isLoading,
      addingId,
      favoritePokemonIds,
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
      addToFavorites,
    ],
  );
}
