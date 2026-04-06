import { IsOptional, IsString, MaxLength } from 'class-validator';

// DTO: validates and transforms incoming request data.
export class UpdateFavoritePokemonDto {
  // Validates that the comments is an optional string with a maximum length of 255 characters.
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'El comentario no puede tener más de 255 caracteres',
  })
  comments!: string;
}
