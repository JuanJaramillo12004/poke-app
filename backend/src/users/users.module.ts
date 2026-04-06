import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
  // Imports: integrates Prisma for database access.
  imports: [PrismaModule],
  // Providers and exports: sets up the UsersService for user-related business logic and makes it available for injection in other modules.
  providers: [UsersService],
  exports: [UsersService],
})
// Module: provides user lookup and persistence services.
export class UsersModule {}
