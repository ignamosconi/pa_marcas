//mostrar-nombre-marca.dto.ts

import { Expose } from "class-transformer";

//No usamos class validators porque este DTO es de salida
export class MostrarNombreMarcaDto {
  @Expose()
  id: number;
  
  @Expose()
  nombre: string;
}