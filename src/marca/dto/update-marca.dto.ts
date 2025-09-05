//update-marca.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marca.dto';


//Usamos ParticalType porque hace que todos los campos sean automáticamente opcionales,
//lo que es ideal para actualizar cosas, porque a veces no vamos a actualizar todo.
export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {}

