//ARCHIVO: marca.service.ts

import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';   //Aprovechamos para importar el logger
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MostrarNombreMarcaDto } from './dto/mostrar-nombre-marca.dto';
import { MostrarMarcaCompletaDto } from './dto/mostrar-marca-completa.dto';
import { plainToInstance } from 'class-transformer';
import type { IMarcaRepository } from './repositories/marca.repository.interface';
import { PaginacionMarcaDto } from './dto/paginacion-marca.dto';
import { MarcaValidator } from './validators/marca.validator';


@Injectable()
export class MarcaService {

  /*
  LOGGER
  Nos permitirá registrar todas las transacciones que se realicen en la aplicación
  */
  private readonly logger = new Logger(MarcaService.name);

  /*
  CONSTRUCTOR
  Inyectamos marca.respository.ts; que va a ser quien se conecta con TypeORM
  
  Indicamos 'IMarcaRepository' porque en marca.module.ts definimos que IMarcaRepository utiliza la 
  clase MarcaRepository, que es donde terminamos accediendo con TypeORM.
  */
  constructor(
    @Inject('IMarcaRepository')
    private readonly marcaRepository: IMarcaRepository,
    private readonly marcaValidator: MarcaValidator,
  ) {}


  /*
  CONSULTAS
  */
  //Es async porque tenemos que esperar la consulta a la BD, y esto se hará en paralelo.
  async findAll(): Promise<MostrarMarcaCompletaDto[]> {
    this.logger.log("Buscando todas las marcas...");

    //El service NO se conecta a la BD!! Delegamos al repository!!!! 
    const marcas = await this.marcaRepository.findAll()

    //Si devolvemos directamente el find, estamos devolviendo la entidad. Hacemos un transform
    //para usar los DTO que definimos.
    return plainToInstance(MostrarMarcaCompletaDto, marcas, {
      excludeExtraneousValues: true,      //Sólo lo decorado con @Expose() en el DTO va a mostrarse.
    });
  }

  
  async findOne(id: number): Promise<MostrarMarcaCompletaDto> {
    this.logger.log(`Buscando la marca ID:${id}`)
    
    const marca = await this.marcaValidator.validarExistencia(id);
    
    this.logger.debug(`Marca ${marca?.nombre} encontrada`)
    
    return plainToInstance(MostrarMarcaCompletaDto, marca, {
      excludeExtraneousValues: true,
    });
  }

  async findPag(paginacion: PaginacionMarcaDto) {
    const pag = paginacion.pag
    const mostrar = paginacion.mostrar
    this.logger.log(`Buscando marcas paginadas: Página N° ${pag}, mostrando ${mostrar} ítems`);

    

    //Recordemos que findPaginado nos devuelve [array de página, n° de elementos en total]
    const [marcas, total] = await this.marcaRepository.findPag(pag, mostrar);

    return {
      total,
      data: plainToInstance(MostrarMarcaCompletaDto, marcas, {
        excludeExtraneousValues: true,
      }),
    };
  }


  //Ver los soft deletes y los que siguen activos
  async verSoftDeletes(): Promise<MostrarNombreMarcaDto[]> {
    this.logger.log("Buscando las marcas soft-deleted...");

    const marcas = await this.marcaRepository.findSoftDeleted()

    return plainToInstance(MostrarNombreMarcaDto, marcas, {
      excludeExtraneousValues: true,
    });
}



  /*
  CREAR
  Si vamos a crear algo, tenemos que respetar los DTOs que hayamos creado. 
  Podemos tener múltiples DTOs, para crear un objeto de diferentes formas, según nuestras
  necesidades. Devolvemos un Promise<Marca> porque TypeORM devuelve el objeto creado, lo que
  nos permite chequear.

  Devolver el Promise<Marca> no es óptimo, ya que estamos devolviendo la entidad completa, y quizá el 
  front no necesita eso. Armamos un DTO acorde a lo que queremos mostrar. 
  */
  async crearMarca(createMarcaDto: CreateMarcaDto): Promise<MostrarMarcaCompletaDto> {
    
    this.logger.log(`Creando marca: ${createMarcaDto.nombre}`);

    //Si la marca ya existe, no la creamos. Si salta la exception el resto del código NO se ejecuta.
    await this.marcaValidator.validarNombreUnico(createMarcaDto.nombre);

    //Creamos la marga
    const marcaCreada = await this.marcaRepository.create(createMarcaDto);

    //Devolvemos la marca creada, siguiendo el DTO de marca (así no devolvemos la entidad completa)
    return plainToInstance(MostrarMarcaCompletaDto, marcaCreada, { excludeExtraneousValues: true });
  }

  

  /*
  ACTUALIZAR
  */
  async actualizarMarca(id:number, updateMarcaDto: UpdateMarcaDto): Promise<MostrarMarcaCompletaDto> {
    
    //Si en efecto están actualizando el nombre, chequeamos que no se repita. dto.nombre puede ser
    //undefined, asique en ese caso no haríamos este chequeo.
    if (updateMarcaDto.nombre) {
      await this.marcaValidator.validarNombreUnico(updateMarcaDto.nombre, id);
    }
    
    //Si no se disparó el exception con el validator el código sigue ejecutandose. Actualizamos
    const marcaActualizada = this.marcaRepository.update(id, updateMarcaDto)  //No hace falta el await, porque es lo último que hacemos.
    this.logger.log(`Marca actualizada: ID ${id}, nuevo nombre: ${(await marcaActualizada).nombre}, nueva descripción: ${(await marcaActualizada).descripcion}`);

    return plainToInstance(MostrarMarcaCompletaDto, marcaActualizada, {excludeExtraneousValues: true})
  }

  /*
  ELIMINAR & ASOCIADOS
  */
  //Soft-delete
  async softDeleteMarca(id:number) {
    //Buscamos si la id existe.
    const marca = await this.marcaValidator.validarExistencia(id);
    
    //Si existe, procedemos a hacer el soft-delete y notificarlo.
    await this.marcaRepository.softDelete(id)
    this.logger.log(`Marca ${marca.nombre} eliminada permanentemente.`)
    return { message: `Marca ${marca.nombre} eliminada permanentemente.` };
    }


  //Recuperar un soft delete
  async restaurarMarca(id: number) {
    // Buscar todas las marcas, soft-deleteds o no. Error: La marca directamente no existe.
    const marca = await this.marcaValidator.validarExistenciaConSoftDeleted(id);

    //Si se encontró la marca, tenemos que validar si está soft-deleted (sino, no hay nada que restaurar)
    await this.marcaValidator.validarMarcaEstaSoftDeleted(marca);

    //Si no saltó ninguna exception, el código sigue su ejecución. Restauramos el soft-delete
    await this.marcaRepository.restore(id);

    //Notificamos lo realizado
    this.logger.log(`Marca ${marca.nombre} restaurada correctamente.`)
    return { message: `Marca ${marca.nombre} restaurada correctamente.` };
  }
}
