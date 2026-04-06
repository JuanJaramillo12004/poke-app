export type PokemonBaseStats = Record<string, number>;

export type CachedPokemon = {
  pokemonId: number;
  name: string;
  imageUrl: string;
  types: string[];
  baseStats: PokemonBaseStats;
};

export type PokemonResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
};

export type PokemonListResponse = {
  count: number;
  results: Array<{ name: string }>;
};

export type PokemonCacheRow = {
  pokemonId: number;
  name: string;
  imageUrl: string;
  types: unknown;
  baseStats: unknown;
};
