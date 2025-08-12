import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty()       //Añadimos validadores según necesitemos.
  nombre: string;     //No deuda técnica!!!

  @IsString()
  @IsOptional()
  descripcion: string;
}