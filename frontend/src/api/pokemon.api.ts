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

// API functions: interact with the backend Pokemon endpoints, handling data transformation and error management as needed.
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

// API function: retrieves a single favorite Pokemon by its ID.
export async function getFavoritePokemons(
  params?: FavoritePokemonQueryParams,
): Promise<FavoritePokemonListResponse> {
  const response = await api.get<FavoritePokemonListResponse>("/pokemon", {
    params,
  });
  return response.data;
}

// API function: retrieves a single favorite Pokemon by its ID.
export async function getFavoritePokemonById(
  id: number,
): Promise<FavoritePokemon> {
  const response = await api.get<FavoritePokemon>(`/pokemon/${id}`);
  return response.data;
}

// API function: creates a new favorite Pokemon for the authenticated user.
export async function createFavoritePokemon(
  payload: CreateFavoritePokemonDto,
): Promise<FavoritePokemon> {
  const response = await api.post<FavoritePokemon>("/pokemon", payload);
  return response.data;
}

// API function: updates an existing favorite Pokemon by its ID with the provided data.
export async function updateFavoritePokemon(
  id: number,
  payload: UpdateFavoritePokemonDto,
): Promise<FavoritePokemon> {
  const response = await api.put<FavoritePokemon>(`/pokemon/${id}`, payload);
  return response.data;
}

// API function: deletes a favorite Pokemon by its ID and returns the deleted resource.
export async function deleteFavoritePokemon(
  id: number,
): Promise<FavoritePokemon> {
  const response = await api.delete<FavoritePokemon>(`/pokemon/${id}`);
  return response.data;
}
