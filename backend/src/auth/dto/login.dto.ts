import { IsEmail, IsString, MinLength } from 'class-validator';

// DTO: validates and transforms incoming request data.
export class LoginDto {
  // Validates that the email is in a proper format and is required.
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email!: string;

  // Validates that the password is a string, has a minimum length of 8 characters, and is required.
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;
}
