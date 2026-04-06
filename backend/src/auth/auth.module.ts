import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  // Imports: integrates user management, JWT handling, and authentication strategies.
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresInSeconds = Number(
          configService.get<string>('JWT_EXPIRES_IN_SECONDS') ?? 3600,
        );

        if (!secret) {
          throw new Error(
            'JWT_SECRET no esta definido en variables de entorno',
          );
        }

        return {
          secret,
          signOptions: {
            expiresIn: Number.isFinite(expiresInSeconds)
              ? expiresInSeconds
              : 3600,
          },
        };
      },
    }),
  ],
  // Controllers and providers: sets up the authentication controller, service, and JWT strategy for handling authentication logic and endpoints.
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
// Module: configures authentication controllers, services, and JWT strategy.
export class AuthModule {}
