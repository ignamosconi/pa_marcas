//create-marca.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ.\- ]*$/;

export class CreateMarcaDto {
  @ApiProperty({ description: 'Nombre de la Marca que queremos crear. No puede tener más de 64 caracteres, y solo puede contener letras, números, puntos y guiones.' })
  @IsString()
  @IsNotEmpty()       //Añadimos validadores según necesitemos.
  @MaxLength(64, { message: 'El nombre no puede tener más de 64 caracteres.' })
  @Matches(ALLOWED_CHARACTERS_REGEX, {
    message: 'El nombre solo puede contener letras, números, puntos (.) y guiones (-).',
  })
  nombre: string;

  @ApiProperty({ description: 'Descripción de la Marca que queremos crear. No puede tener más de 255 caracteres, y solo puede contener letras, números, puntos y guiones.' })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'La descripción no puede tener más de 255 caracteres.' })
  @Matches(ALLOWED_CHARACTERS_REGEX, {
    message: 'La descripción solo puede contener letras, números, puntos (.) y guiones (-).',
  })
  descripcion: string;
}