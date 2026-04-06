import {
  ConflictException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoritePokemonDto } from './dto/create-favorite-pokemon.dto';
import { QueryFavoritePokemonDto } from './dto/query-favorite-pokemon.dto';
import { QueryPokemonDto } from './dto/query-pokemon.dto';
import { UpdateFavoritePokemonDto } from './dto/update-favorite-pokemon.dto';
import {
  CachedPokemon,
  PokemonBaseStats,
  PokemonCacheRow,
  PokemonListResponse,
  PokemonResponse,
} from './types/pokemon.types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

@Injectable()
export class PokemonService {
  constructor(private readonly prisma: PrismaService) {}

  private parseJsonArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is string => typeof item === 'string',
          );
        }
      } catch {
        return [];
      }
    }

    return [];
  }

  private parseJsonRecord(value: unknown): PokemonBaseStats {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value).filter(
        (entry): entry is [string, number] => typeof entry[1] === 'number',
      );
      return Object.fromEntries(entries);
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          !Array.isArray(parsed)
        ) {
          const entries = Object.entries(parsed).filter(
            (entry): entry is [string, number] => typeof entry[1] === 'number',
          );
          return Object.fromEntries(entries);
        }
      } catch {
        return {};
      }
    }

    return {};
  }

  private mapRowToCachedPokemon(row: PokemonCacheRow): CachedPokemon {
    return {
      pokemonId: row.pokemonId,
      name: row.name,
      imageUrl: row.imageUrl,
      types: this.parseJsonArray(row.types),
      baseStats: this.parseJsonRecord(row.baseStats),
    };
  }

  private async countPokemonCache(): Promise<number> {
    const result = await this.prisma.$queryRaw<Array<{ total: number }>>`
      SELECT COUNT(*) as total
      FROM "PokemonCache"
    `;

    return Number(result[0]?.total ?? 0);
  }

  private async listPokemonCache(
    skip: number,
    take: number,
  ): Promise<CachedPokemon[]> {
    const rows = await this.prisma.$queryRaw<PokemonCacheRow[]>`
      SELECT "pokemonId", "name", "imageUrl", "types", "baseStats"
      FROM "PokemonCache"
      ORDER BY "pokemonId" ASC
      LIMIT ${take} OFFSET ${skip}
    `;

    return rows.map((row) => this.mapRowToCachedPokemon(row));
  }

  private async listAllPokemonCache(): Promise<CachedPokemon[]> {
    const rows = await this.prisma.$queryRaw<PokemonCacheRow[]>`
      SELECT "pokemonId", "name", "imageUrl", "types", "baseStats"
      FROM "PokemonCache"
      ORDER BY "pokemonId" ASC
    `;

    return rows.map((row) => this.mapRowToCachedPokemon(row));
  }

  private async fetchPokemonData(name: string): Promise<PokemonResponse> {
    const response = await fetch(`${POKEAPI_BASE_URL}/${name}`);

    if (!response.ok) {
      throw new NotFoundException(`Pokemon con nombre "${name}" no encontrado`);
    }

    return (await response.json()) as PokemonResponse;
  }

  private mapToCachedPokemon(pokemon: PokemonResponse): CachedPokemon {
    return {
      pokemonId: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.sprites.front_default ?? '',
      types: pokemon.types.map((t) => t.type.name),
      baseStats: this.mapBaseStats(pokemon.stats),
    };
  }

  private async fetchPokemonList(
    offset: number,
    limit: number,
  ): Promise<PokemonListResponse> {
    const response = await fetch(
      `${POKEAPI_BASE_URL}?offset=${offset}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new InternalServerErrorException(
        'No fue posible consultar la PokeAPI',
      );
    }

    return (await response.json()) as PokemonListResponse;
  }

  private async upsertPokemonCache(pokemon: PokemonResponse) {
    const mapped = this.mapToCachedPokemon(pokemon);

    await this.prisma.$executeRaw`
      INSERT INTO "PokemonCache" (
        "pokemonId",
        "name",
        "imageUrl",
        "types",
        "baseStats",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${mapped.pokemonId},
        ${mapped.name},
        ${mapped.imageUrl},
        ${JSON.stringify(mapped.types)},
        ${JSON.stringify(mapped.baseStats)},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT("pokemonId") DO UPDATE SET
        "name" = excluded."name",
        "imageUrl" = excluded."imageUrl",
        "types" = excluded."types",
        "baseStats" = excluded."baseStats",
        "updatedAt" = CURRENT_TIMESTAMP
    `;

    return mapped;
  }

  private async getOrCreatePokemonCacheByIdentifier(identifier: string) {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const parsedId = Number(normalizedIdentifier);
    const pokemonId =
      Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

    const where = pokemonId
      ? Prisma.sql`WHERE "pokemonId" = ${pokemonId} OR "name" = ${normalizedIdentifier}`
      : Prisma.sql`WHERE "name" = ${normalizedIdentifier}`;

    const fromCacheRows = await this.prisma.$queryRaw<PokemonCacheRow[]>`
      SELECT "pokemonId", "name", "imageUrl", "types", "baseStats"
      FROM "PokemonCache"
      ${where}
      LIMIT 1
    `;

    const fromCache = fromCacheRows[0];

    if (fromCache) {
      return this.mapRowToCachedPokemon(fromCache);
    }

    const pokemon = await this.fetchPokemonData(normalizedIdentifier);
    return this.upsertPokemonCache(pokemon);
  }

  private async hydrateCacheUntil(requiredCount: number) {
    let currentCount = await this.countPokemonCache();

    while (currentCount < requiredCount) {
      const batchLimit = Math.min(20, requiredCount - currentCount);
      const list = await this.fetchPokemonList(currentCount, batchLimit);

      if (!list.results.length) {
        break;
      }

      for (const item of list.results) {
        const pokemon = await this.fetchPokemonData(item.name);
        await this.upsertPokemonCache(pokemon);
      }

      currentCount = await this.countPokemonCache();

      if (currentCount >= list.count) {
        break;
      }
    }
  }

  private mapBaseStats(stats: PokemonResponse['stats']): PokemonBaseStats {
    return stats.reduce<PokemonBaseStats>((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});
  }

  async createFavoritePokemon(
    userId: number,
    createFavoritePokemonDto: CreateFavoritePokemonDto,
  ) {
    const pokemon = await this.getOrCreatePokemonCacheByIdentifier(
      createFavoritePokemonDto.name,
    );

    try {
      return await this.prisma.favoritePokemon.create({
        data: {
          userId,
          pokemonId: pokemon.pokemonId,
          name: pokemon.name,
          imageUrl: pokemon.imageUrl,
          types: pokemon.types,
          baseStats: pokemon.baseStats,
          comments: createFavoritePokemonDto.comments,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Este Pokémon ya es tu favorito');
      }
      throw error;
    }
  }

  async findAllPokemons(query: QueryPokemonDto) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 20);
    const skip = (page - 1) * limit;
    const requiredCount = page * limit;
    const search = query.search?.trim().toLowerCase();
    const typeFilter = query.type?.trim().toLowerCase();

    await this.hydrateCacheUntil(requiredCount);

    if (search || typeFilter) {
      const allCached = await this.listAllPokemonCache();

      const filtered = allCached.filter((item) => {
        const types = item.types;
        const matchesSearch = search
          ? item.name.toLowerCase().includes(search)
          : true;
        const matchesType = typeFilter
          ? types.some(
              (t) => typeof t === 'string' && t.toLowerCase() === typeFilter,
            )
          : true;

        return matchesSearch && matchesType;
      });

      return {
        data: filtered.slice(skip, skip + limit),
        meta: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
        },
      };
    }

    const [data, total] = await Promise.all([
      this.listPokemonCache(skip, limit),
      this.countPokemonCache(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllFavoritePokemons(
    userId: number,
    query: QueryFavoritePokemonDto,
  ) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 20);
    const skip = (page - 1) * limit;
    const search = query.search?.trim().toLowerCase();

    if (query.type) {
      const typeFilter = query.type.toLowerCase();
      const allFavorites = await this.prisma.favoritePokemon.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const filtered = allFavorites.filter((item) => {
        const matchesSearch = search
          ? item.name.toLowerCase().includes(search)
          : true;

        const matchesType = Array.isArray(item.types)
          ? item.types.some(
              (t) => typeof t === 'string' && t.toLowerCase() === typeFilter,
            )
          : false;

        return matchesSearch && matchesType;
      });

      const total = filtered.length;
      const data = filtered.slice(skip, skip + limit);

      return {
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    const where: Prisma.FavoritePokemonWhereInput = {
      userId,
      ...(search ? { name: { contains: search } } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.favoritePokemon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.favoritePokemon.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneFavoritePokemon(userId: number, id: number) {
    const favoritePokemon = await this.prisma.favoritePokemon.findFirst({
      where: { id, userId },
    });

    if (!favoritePokemon) {
      throw new NotFoundException('Pokemon favorito no encontrado');
    }

    return favoritePokemon;
  }

  async updateFavoritePokemon(
    userId: number,
    id: number,
    updateDto: UpdateFavoritePokemonDto,
  ) {
    const favoritePokemon = await this.prisma.favoritePokemon.findFirst({
      where: { id, userId },
    });

    if (!favoritePokemon) {
      throw new NotFoundException('Pokemon favorito no encontrado');
    }

    return this.prisma.favoritePokemon.update({
      where: { id },
      data: {
        comments: updateDto.comments,
      },
    });
  }

  async removeFavoritePokemon(userId: number, id: number) {
    const favoritePokemon = await this.prisma.favoritePokemon.findFirst({
      where: { id, userId },
    });

    if (!favoritePokemon) {
      throw new NotFoundException('Pokemon favorito no encontrado');
    }

    return this.prisma.favoritePokemon.delete({
      where: { id },
    });
  }
}
