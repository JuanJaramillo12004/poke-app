// Type alias: PokemonBaseStats.
export type PokemonBaseStats = Record<string, number>;

// Type alias: FavoritePokemon.
export type FavoritePokemon = {
  id: number;
  userId: number;
  pokemonId: number;
  name: string;
  imageUrl: string;
  types: string[];
  baseStats: PokemonBaseStats;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
};

// Pagination metadata returned by list endpoints.
export type FavoritePokemonMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// API response shape used by consumers of this endpoint.
export type FavoritePokemonListResponse = {
  data: FavoritePokemon[];
  meta: FavoritePokemonMeta;
};

// DTO type: contract used for request payloads.
export type CreateFavoritePokemonDto = {
  name: string;
  comments?: string;
};

// DTO type: contract used for request payloads.
export type UpdateFavoritePokemonDto = {
  comments?: string;
};

// Query params supported by list or search requests.
export type FavoritePokemonQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
};

// Type alias: CatalogPokemon.
export type CatalogPokemon = {
  pokemonId: number;
  name: string;
  imageUrl: string;
  types: string[];
  baseStats: PokemonBaseStats;
};

// Pagination metadata returned by list endpoints.
export type CatalogPokemonMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// API response shape used by consumers of this endpoint.
export type CatalogPokemonListResponse = {
  data: CatalogPokemon[];
  meta: CatalogPokemonMeta;
};

// Query params supported by list or search requests.
export type CatalogPokemonQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
};
