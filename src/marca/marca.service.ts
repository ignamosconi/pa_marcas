import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';   //Aprovechamos para importar el logger
import { IsNull, Not, } from 'typeorm';
import { Marca } from './marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MostrarNombreMarcaDto } from './dto/mostrar-nombre-marca.dto';
import { MostrarMarcaCompletaDto } from './dto/mostrar-marca-completa.dto';
import { plainToInstance } from 'class-transformer';
import type { IMarcaRepository } from './repositories/marca.repository.interface';


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
    const marca = await this.marcaRepository.findOne(id);
    if (!marca) {
      this.logger.error(`No se encontró la marca con ID ${id}`)   //Usamos .error en lugar de .log
      throw new NotFoundException(`No se encontró la marca con ID ${id}`);
    }

    this.logger.debug(`Marca ${marca?.nombre} encontrada`)
    
    return plainToInstance(MostrarMarcaCompletaDto, marca, {
      excludeExtraneousValues: true,
    });
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
    this.logger.log(`Creando marca: ${createMarcaDto.nombre}`); //Lo anunciamos por consola.
    const marcaCreada = this.marcaRepository.create(createMarcaDto)

    return plainToInstance(MostrarMarcaCompletaDto, marcaCreada, {excludeExtraneousValues: true})
  }

  /*
  ACTUALIZAR
  */
  async actualizarMarca(id:number, updateMarcaDto: UpdateMarcaDto): Promise<MostrarMarcaCompletaDto> {
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
    const marcaOriginal = await this.marcaRepository.findOne(id);

    if (!marcaOriginal) {
    this.logger.warn(`No se encontró la marca con ID ${id} para eliminar.`);
    throw new NotFoundException(`No se encontró la marca con ID ${id}.`);
    }
    
    //Si existe, la "escondemos". 
    await this.marcaRepository.softDelete(id)
    this.logger.log(`Marca ${marcaOriginal.nombre} eliminada permanentemente.`)
    return { message: `Marca ${marcaOriginal.nombre} eliminada permanentemente.` };
    }


  //Recuperar un soft delete
  async restaurarMarca(id: number) {
    // Buscar todas las marcas, eliminadas o no.
    const marca = await this.marcaRepository.findOneWithDeleted(id)

    if (!marca) {
      this.logger.log(`No existe una marca con ID ${id}`)
      throw new NotFoundException(`No existe una marca con ID ${id}`);
    }

    if (!marca.deletedAt) {
      this.logger.log(`La marca con ID ${id} no está eliminada.`)
      throw new BadRequestException(`La marca con ID ${id} no está eliminada.`);
    }

    await this.marcaRepository.restore(id);
    this.logger.log(`Marca ${marca.nombre} restaurada correctamente.`)
    return { message: `Marca ${marca.nombre} restaurada correctamente.` };
  }
}
