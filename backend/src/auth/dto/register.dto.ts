import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

// Regular expression to validate password complexity: at least one uppercase letter, one lowercase letter, one number, and one special character, with a minimum length of 8 characters.
const VALIDATE_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// DTO: validates and transforms incoming request data.
export class RegisterDto {
  // Validates that the email is in a proper format and is required.
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email!: string;

  // Validates that the password is a string, has a minimum length of 8 characters, and matches the specified complexity requirements.
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(VALIDATE_PASSWORD, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
  })
  password!: string;
}
