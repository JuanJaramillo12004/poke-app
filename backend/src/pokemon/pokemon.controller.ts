import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types/auth.types';
import { CreateFavoritePokemonDto } from './dto/create-favorite-pokemon.dto';
import { QueryFavoritePokemonDto } from './dto/query-favorite-pokemon.dto';
import { QueryPokemonDto } from './dto/query-pokemon.dto';
import { UpdateFavoritePokemonDto } from './dto/update-favorite-pokemon.dto';
import { PokemonService } from './pokemon.service';

@UseGuards(JwtAuthGuard)
@Controller('pokemon')
// Controller: defines HTTP endpoints for the Pokemon.ToLower() feature.
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  // Creates a new favorite Pokemon for the authenticated user using the provided data in the request body.
  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateFavoritePokemonDto) {
    return this.pokemonService.createFavoritePokemon(req.user.id, dto);
  }

  // Retrieves a paginated list of the authenticated user's favorite Pokemon, with optional filtering by name and type based on query parameters.
  @Get()
  findAllFavorites(
    @Req() req: RequestWithUser,
    @Query() query: QueryFavoritePokemonDto,
  ) {
    return this.pokemonService.findAllFavoritePokemons(req.user.id, query);
  }

  // Retrieves a paginated list of Pokemon from the external API, with optional filtering by name and type based on query parameters.
  @Get('catalog')
  findAllCatalog(@Query() query: QueryPokemonDto) {
    return this.pokemonService.findAllPokemons(query);
  }

  // Retrieves a specific favorite Pokemon by its ID for the authenticated user.
  @Get(':id')
  findOneFavorite(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pokemonService.findOneFavoritePokemon(req.user.id, id);
  }

  // Updates the comments of a specific favorite Pokemon by its ID for the authenticated user using the provided data in the request body.
  @Put(':id')
  updateFavorite(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFavoritePokemonDto,
  ) {
    return this.pokemonService.updateFavoritePokemon(req.user.id, id, dto);
  }

  // Deletes a specific favorite Pokemon by its ID for the authenticated user.
  @Delete(':id')
  removeFavorite(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pokemonService.removeFavoritePokemon(req.user.id, id);
  }
}
