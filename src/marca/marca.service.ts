import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';   //Aprovechamos para importar el logger
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Marca } from './marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MostrarNombreMarcaDto } from './dto/mostrar-nombre-marca.dto';
import { MostrarMarcaCompletaDto } from './dto/mostrar-marca-completa.dto';
import { plainToInstance } from 'class-transformer';


@Injectable()
export class MarcaService {

  /*
  LOGGER
  Nos permitirá registrar todas las transacciones que se realicen en la aplicación
  */
  private readonly logger = new Logger(MarcaService.name);

  /*
  CONSTRUCTOR
  A través de TypeORM, injectamos el repositorio de Marca que creamos con PSQL (cuya conexión
  definimos en el archivo marca.module.ts).

  A través de marcaRepository, podremos acceder a múltiples métodos:
    • find  • findOne   • save    • delete
  */
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) {}


  /*
  CONSULTAS
  */
  hola(): string {
    return "Hi mum!"
  }

  //Es async porque tenemos que esperar la consulta a la BD, y esto se hará en paralelo.
  async findAll(): Promise<MostrarMarcaCompletaDto[]> {
    this.logger.log("Buscando todas las marcas...");
    const marcas = await this.marcaRepository.find({
      where: { deletedAt: IsNull() },
    });

    //Si devolvemos directamente el find, estamos devolviendo la entidad. Hacemos un transform
    //para usar los DTO que definimos.
    return plainToInstance(MostrarMarcaCompletaDto, marcas, {
      excludeExtraneousValues: true,      //Sólo lo decorado con @Expose() en el DTO va a mostrarse.
    });
  }

  
  async findOne(id: number): Promise<MostrarMarcaCompletaDto> {
    this.logger.log(`Buscando la marca ID:${id}`)
    const marca = await this.marcaRepository.findOne({ where: { id } });
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
    const marcas = await this.marcaRepository.find({
      withDeleted: true, //´TypeORM por defecto oculta los soft-deleted, con esto los mostramos.
      where: { deletedAt: Not(IsNull()) },    //Escondemos los que no fueron eliminados.
    });

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
    const marcaCreada = this.marcaRepository.save(createMarcaDto)

    return plainToInstance(MostrarMarcaCompletaDto, marcaCreada, {excludeExtraneousValues: true})
  }

  /*
  ACTUALIZAR
  */
  async actualizarMarca(id:number, updateMarcaDto: UpdateMarcaDto): Promise<MostrarMarcaCompletaDto> {
    //Buscamos la marca que tenemos que actualizar
    const marcaOriginal = await this.findOne(id)
    
    //Reemplazamos la marca anterior con la actualizada
    const marcaActualizada = Object.assign(marcaOriginal, updateMarcaDto);
    this.logger.log(`Marca actualizada: ID ${id}, nuevo nombre: ${marcaActualizada.nombre}, nueva descripción: ${marcaActualizada.descripcion}`);
    const marcaNueva = this.marcaRepository.save(marcaActualizada)  //No hace falta el await, porque es lo último que hacemos.

    return plainToInstance(MostrarMarcaCompletaDto, marcaNueva, {excludeExtraneousValues: true})
  }

  /*
  ELIMINAR & ASOCIADOS
  */
  //Soft-delete
  async softDeleteMarca(id:number) {
    //Buscamos si la id existe
    const marcaOriginal = await this.findOne(id);     //await: tenemos que esperar que se resuelva findOne()
    const nombre = marcaOriginal.nombre
    //Si existe, la "escondemos". 
    await this.marcaRepository.softRemove(marcaOriginal)
    this.logger.log(`Marca ${nombre} eliminada permanentemente.`)
    return { message: `Marca ${nombre} eliminada permanentemente.` };
  }


  //Recuperar un soft delete
  async restaurarMarca(id: number) {
    // Buscar todas las marcas, eliminadas o no.
    const marca = await this.marcaRepository.findOne({
      where: { id },
      withDeleted: true,
    });

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
