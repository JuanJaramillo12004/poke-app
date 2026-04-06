export type PokemonBaseStats = Record<string, number>;

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

export type FavoritePokemonMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FavoritePokemonListResponse = {
  data: FavoritePokemon[];
  meta: FavoritePokemonMeta;
};

export type CreateFavoritePokemonDto = {
  name: string;
  comments?: string;
};

export type UpdateFavoritePokemonDto = {
  comments?: string;
};

export type FavoritePokemonQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
};

export type CatalogPokemon = {
  pokemonId: number;
  name: string;
  imageUrl: string;
  types: string[];
  baseStats: PokemonBaseStats;
};

export type CatalogPokemonMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CatalogPokemonListResponse = {
  data: CatalogPokemon[];
  meta: CatalogPokemonMeta;
};

export type CatalogPokemonQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
};
