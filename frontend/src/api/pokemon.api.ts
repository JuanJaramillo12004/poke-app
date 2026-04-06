import { api } from "./axios";
import type {
  CatalogPokemonListResponse,
  CatalogPokemonQueryParams,
  CreateFavoritePokemonDto,
  FavoritePokemon,
  FavoritePokemonListResponse,
  FavoritePokemonQueryParams,
  UpdateFavoritePokemonDto,
} from "../types/pokemon.types";

export async function getCatalogPokemons(
  params?: CatalogPokemonQueryParams,
): Promise<CatalogPokemonListResponse> {
  const response = await api.get<CatalogPokemonListResponse>(
    "/pokemon/catalog",
    {
      params,
    },
  );
  return response.data;
}

export async function getFavoritePokemons(
  params?: FavoritePokemonQueryParams,
): Promise<FavoritePokemonListResponse> {
  const response = await api.get<FavoritePokemonListResponse>("/pokemon", {
    params,
  });
  return response.data;
}

export async function getFavoritePokemonById(
  id: number,
): Promise<FavoritePokemon> {
  const response = await api.get<FavoritePokemon>(`/pokemon/${id}`);
  return response.data;
}

export async function createFavoritePokemon(
  payload: CreateFavoritePokemonDto,
): Promise<FavoritePokemon> {
  const response = await api.post<FavoritePokemon>("/pokemon", payload);
  return response.data;
}

export async function updateFavoritePokemon(
  id: number,
  payload: UpdateFavoritePokemonDto,
): Promise<FavoritePokemon> {
  const response = await api.put<FavoritePokemon>(`/pokemon/${id}`, payload);
  return response.data;
}

export async function deleteFavoritePokemon(
  id: number,
): Promise<FavoritePokemon> {
  const response = await api.delete<FavoritePokemon>(`/pokemon/${id}`);
  return response.data;
}
