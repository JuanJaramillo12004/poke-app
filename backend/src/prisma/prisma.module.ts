import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // Providers: makes PrismaService available for dependency injection throughout the application.
  providers: [PrismaService],
  exports: [PrismaService],
})
// Module: shares PrismaService across the application.
export class PrismaModule {}
