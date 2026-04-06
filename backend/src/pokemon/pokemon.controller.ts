import { Controller, Get, Query } from '@nestjs/common';
import { QueryPokemonDto } from './dto/query-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAllPokemons(@Query() query: QueryPokemonDto) {
    return this.pokemonService.findAllPokemons(query);
  }
}
