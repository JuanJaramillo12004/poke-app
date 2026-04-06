import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFavoritePokemonDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'El comentario no puede tener más de 255 caracteres',
  })
  comments!: string;
}
