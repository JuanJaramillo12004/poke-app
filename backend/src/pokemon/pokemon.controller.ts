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
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateFavoritePokemonDto) {
    return this.pokemonService.createFavoritePokemon(req.user.id, dto);
  }

  @Get()
  findAllFavorites(
    @Req() req: RequestWithUser,
    @Query() query: QueryFavoritePokemonDto,
  ) {
    return this.pokemonService.findAllFavoritePokemons(req.user.id, query);
  }

  @Get('catalog')
  findAllCatalog(@Query() query: QueryPokemonDto) {
    return this.pokemonService.findAllPokemons(query);
  }

  @Get(':id')
  findOneFavorite(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pokemonService.findOneFavoritePokemon(req.user.id, id);
  }

  @Put(':id')
  updateFavorite(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFavoritePokemonDto,
  ) {
    return this.pokemonService.updateFavoritePokemon(req.user.id, id, dto);
  }

  @Delete(':id')
  removeFavorite(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pokemonService.removeFavoritePokemon(req.user.id, id);
  }
}
