//ARCHIVO: marca.controller.ts

import { Controller, Post, Body, Patch, Param, ParseIntPipe, Get, Delete, Query } from '@nestjs/common';
import { MarcaService } from './marca.service'; 
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MostrarNombreMarcaDto } from './dto/mostrar-nombre-marca.dto';
import { MostrarMarcaCompletaDto } from './dto/mostrar-marca-completa.dto';
import { PaginacionMarcaDto } from './dto/paginacion-marca.dto';

/*
ARQUITECTURA POR CAPAS. Somos una lasagna (ñam)

[ Controller ]: Recibe la petición HTTP. Es bobo, entonces delega al service.
      ↓
[ MarcaService ]: Trabaja todo lo que tiene que hacer, pero delega la BD al repository
      ↓ 
[ IMarcaRepository (interfaz) ]: El repository se define a través de una interfaz, que contiene todos los métodos que el controller / service pueden llegar a usar.
      ↓
[ MarcaRepository (TypeORM + PostgreSQL) ]: Finalmente es nuestro respository el que se conecta a la base de datos PostgreSQL, a través de TypeORM. 



(!) IMPORTANTE: Ya no es el service el que utiliza TypeORM para conectarse a la BD, sino que el éste
delega a un Repository.

(!!) El "Modelo" incluye el repository, su interfaz y la entidad (marca, en este caso).
*/



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
  
  //Get que muestra todas las marcas, soft-deleted o no.
  @Get('eliminadas')    // ruta: /marca/eliminadas
  verSoftDeletes(): Promise<MostrarNombreMarcaDto[]> {
    return this.marcaService.verSoftDeletes();
  }

  //Get que sólo muestra solo las marcas que NO están eliminadas.
  @Get()                                  //Hacer un get a /marca
  findAll(): Promise<MostrarMarcaCompletaDto[]> {
    return this.marcaService.findAll();
  } 

  // En la práctica no devolvemos todos los elementos, devolvemos páginas.
  //Esta query tiene el formato: 
  //                /marca/pag?pag=2&mostrar=5
  // El "?" indica que empiezan los @Query(), entonces sabemos que page es 2 y limit es 5.
  @Get('pag')
  async findPag(@Query() paginacion: PaginacionMarcaDto) {
    return this.marcaService.findPag(paginacion);
  }

  @Get(":id")                             //Hacer un get a /marca/35, por ejemplo.
  findOne(
    @Param("id", ParseIntPipe) id:number,
  ): Promise<MostrarMarcaCompletaDto> {
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
  ): Promise<MostrarMarcaCompletaDto> {                       //Devolvemos la marca creada, para chequear.
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
  ): Promise<MostrarMarcaCompletaDto> {
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