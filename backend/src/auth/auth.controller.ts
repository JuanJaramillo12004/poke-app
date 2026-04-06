import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { RequestWithUser } from './types/auth.types';

// Controller: defines HTTP endpoints for authentication-related actions (register, login, profile).
@Controller('auth')
// Controller: handles incoming HTTP requests related to authentication and delegates business logic to the AuthService.
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint: POST /auth/register - registers a new user with the provided email and password.
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Endpoint: POST /auth/login - authenticates a user and returns a JWT token if the credentials are valid.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Endpoint: GET /auth/profile - returns the authenticated user's profile information. Requires a valid JWT token in the Authorization header.
  @UseGuards(JwtAuthGuard)
  // Protected endpoint: only accessible with a valid JWT token. Returns the user's profile information extracted from the token.
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  // Handler: extracts the user information from the request (populated by the JwtAuthGuard) and returns it as the response.
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
