import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// DTO: validates and transforms incoming request data.
export class QueryPokemonDto {
  // Validates that the page is an optional integer greater than or equal to 1. If not provided, defaults to 1.
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor o igual a 1' })
  page?: number = 1;

  // Validates that the limit is an optional integer between 1 and 20. If not provided, defaults to 20.
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
  @Max(20, { message: 'El límite no puede ser mayor a 20' })
  limit?: number = 20;

  // Validates that the type is an optional string.
  @IsOptional()
  @IsString()
  type?: string;

  // Validates that the search is an optional string.
  @IsOptional()
  @IsString()
  search?: string;
}
