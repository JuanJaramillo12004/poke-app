// Type alias: PokemonBaseStats.
export type PokemonBaseStats = Record<string, number>;

// Type alias: CachedPokemon.
export type CachedPokemon = {
  pokemonId: number;
  name: string;
  imageUrl: string;
  types: string[];
  baseStats: PokemonBaseStats;
};

// API response shape used by consumers of this endpoint.
export type PokemonResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
};

// API response shape used by consumers of this endpoint.
export type PokemonListResponse = {
  count: number;
  results: Array<{ name: string }>;
};

// Type alias: PokemonCacheRow.
export type PokemonCacheRow = {
  pokemonId: number;
  name: string;
  imageUrl: string;
  types: unknown;
  baseStats: unknown;
};
