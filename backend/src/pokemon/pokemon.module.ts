import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

@Module({
  // Imports: integrates Prisma for database access.
  imports: [PrismaModule],
  // Providers and controllers: sets up the PokemonService for business logic and PokemonController for handling HTTP requests related to Pokemon.
  providers: [PokemonService],
  controllers: [PokemonController],
})
// Module: groups Pokemon catalog and favorites endpoints with their service.
export class PokemonModule {}
