import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  // Imports: sets up global configuration and integrates feature modules for authentication, user management, database access, and Pokemon-related functionality.
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    PokemonModule,
  ],
  // Controllers and providers: registers the AppController for handling root HTTP requests and the AppService for providing application-wide business logic.
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
