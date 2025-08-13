import { Controller, Post, Body, Patch, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { MarcaService } from './marca.service'; 
import { Marca } from './marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Controller('marca') // Este controlador maneja las rutas /marca
export class MarcaController {

  /*
  CONSTRUCTOR
  El constructor el pide a nestJS que genere una instancia de marcaService, para que podamos
  delegarle tareas. Esto será una "deuda técnica", ya que un service muy cargado no es ideal, y lo
  solucionaremos más adelante utilizando Strategy.
  */
  constructor(private readonly marcaService: MarcaService) {}

  /*
  ENDPOINTS
  El controller será "bobo": el service se encargará de todo. 
  */

  
  //Consultas
  @Get('/hola')     //Si hacés un get a /marca/hola, se ejecuta la función getHello()
  hola(): string {
    return this.marcaService.hola();
  }


  //Get que además muestra los soft-deletes
  @Get('eliminadas')    // ruta: /marca/eliminadas
  verSoftDeletes(): Promise<Marca[]> {
    return this.marcaService.verSoftDeletes();
  }

  //Get que sólo muestra las que NO están soft-deleted
  @Get()                                  //Hacer un get a /marca
  findAll(): Promise<Marca[]> {
    return this.marcaService.findAll();
  } 

  @Get(":id")                             //Hacer un get a /marca/35, por ejemplo.
  findOne(
    @Param("id", ParseIntPipe) id:number,
  ): Promise<Marca> {
    return this.marcaService.findOne(id);
  } 


  /*
  BODY: 
  En las solicitudes Post o Patch, el cliente envía datos en el "body" o cuerpo del HTTP.  
  El decorador @Body nos permite extraer estos datos y asignarlos a una instancia del DTO, en 
  este caso createMarcaDto.

  Si la solicitud fue, por ejemplo:
    {
      nombre: "Nike",
      descripcion: "Deportes" 
    }
  los parámetros "nombre" y "descripcion" van a asignarse a createMarcaDto.

  Si la solicitud tiene un JSON con parámetros incorrectos, por ejemplo:
    {
      nombre111: 725,
      apellido: "Mosconi"
    }
  el método va a devolver un error, siempre y cuando las validaciones de Validation global estén
  activadas. En este caso se devolvería un error 400, porque:
    • Los campos "nombre111" y "apellido" no están definidos ni permitidos en createMarcaDto.
    • El dato numérico no es válido para ningún parámetro
  */


  //Crear objetos
  @Post()
  crearMarca(
    @Body() createMarcaDto: CreateMarcaDto  //Explicación Body en el comentario de arriba.
  ): Promise<Marca> {                       //Devolvemos la marca creada, para chequear.
    return this.marcaService.crearMarca(createMarcaDto)
  }

  /*
  @Param
  Permite extraer parámetros de URLs. Si ponemos @Param("id"), se va a buscar el parámetro id que 
  hayamos definido en la ruta, en este caso :id.
  */

  //Actualizar objetos
  @Patch(":id") //Si mandás una solicitud a /marca/35, vamos a actualizar la id 35.
  actualizarMarca (
    @Param("id", ParseIntPipe) id:number,
    @Body() updateMarcaDto: UpdateMarcaDto 
  ): Promise<Marca> {
    return this.marcaService.actualizarMarca(id, updateMarcaDto)
  }

  /*
  ELIMINAR y RESTAURAR
  */

  //Soft-delete
  @Delete("/softdel/:id")
  softDeleteMarca(
    @Param("id", ParseIntPipe) id:number  //Para borrar sólo nos hace falta la ID, no el body.
  ) {
    return this.marcaService.softDeleteMarca(id);
  }

  @Delete("/res/:id")
  restaurarMarca(
      @Param("id", ParseIntPipe) id:number
  ) {
    return this.marcaService.restaurarMarca(id)
  }
}