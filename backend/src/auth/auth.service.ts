import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
// Service: handles user registration, credential validation, and JWT issuance.
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Registers a new user by hashing the password and saving the user to the database. Returns the created user's information without the password.
  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Creates a new user in the database with the provided email and hashed password.
    const user = await this.usersService.createUser({
      email: registerDto.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Authenticates a user by validating the provided email and password. If valid, generates and returns a JWT token; otherwise, throws an unauthorized exception.
  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; token_type: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    // Compares the provided password with the stored hashed password using bcrypt. If the password is invalid, throws an unauthorized exception.
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    // Generates a JWT token containing the user's ID and email as the payload. The token is signed using the secret key defined in the application's configuration.
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
    };
  }
}
