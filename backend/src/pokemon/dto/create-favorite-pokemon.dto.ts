import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFavoritePokemonDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'El comentario no puede tener más de 255 caracteres',
  })
  comments!: string;
}
