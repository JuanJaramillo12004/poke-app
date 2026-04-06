import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// DTO: validates and transforms incoming request data.
export class CreateFavoritePokemonDto {
  // Validates that the name is a string, has a minimum length of 1 character, and is required.
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  name!: string;

  // Validates that the comments is an optional string with a maximum length of 255 characters.
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'El comentario no puede tener más de 255 caracteres',
  })
  comments!: string;
}
