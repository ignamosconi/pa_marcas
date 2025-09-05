//mostrar-marca-completa.dto.ts

//No usamos class validators porque este DTO es de salida.

//Sí usamos class-transformer. El decorador @Expose() indica que esos atributos deben mostrarse cuando
//se transforma la entidad Marca (por ejemplo, cuando se extrae de la BD) a un DTO, a través del 
//método plainToInstance{DTO, entidad a transformar, {excludeExtraneousValues: true }}. Este último
//parámetro nos asegura que sólo lo decorado con @Expose() en el DTO va a mostrarse.

//Para ver el proceso de transformación en acción, ir al código del service findAll()

import { Expose } from "class-transformer";


export class MostrarMarcaCompletaDto {

  @Expose()     //Si queremos ocultar las IDs a los clientes, borramos el expose
  id: number    //Yo ahora lo dejo para testear

  @Expose()
  nombre: string;

  @Expose()
  descripcion: string;


  deletedAt: Date;      //Este no tiene el @Expose(), por lo que no se transforma y no se muestra.
}