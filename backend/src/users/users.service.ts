import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './types/users.types';

@Injectable()
// Service: provides user-related business logic, including creating users and retrieving users by email or ID, while handling database constraints and errors appropriately.
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Creates a new user in the database with the provided data, handling unique constraint violations on the email field by throwing a conflict exception.
  async createUser(data: CreateUserInput) {
    // Translate failures into explicit domain or HTTP errors.
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El email ya esta registrado');
      }
      throw error;
    }
  }

  // Retrieves a user from the database by their email address, returning null if no user is found.
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Retrieves a user from the database by their unique ID, returning null if no user is found.
  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
