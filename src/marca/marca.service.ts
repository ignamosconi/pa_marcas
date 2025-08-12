import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcaService {

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
    return 'hi mum!';
  }

  //Es async porque tenemos que esperar la consulta a la BD, y esto se hará en paralelo.
  async findAll(): Promise<Marca[]> {
    return await this.marcaRepository.find()
  }

  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({ where: { id } });
    if (!marca) {
     throw new NotFoundException(`No se encontró la marca con ID ${id}`);
    }
    return marca;
  }


  /*
  CREAR
  Si vamos a crear algo, tenemos que respetar los DTOs que hayamos creado. 
  Podemos tener múltiples DTOs, para crear un objeto de diferentes formas, según nuestras
  necesidades. Devolvemos un Promise<Marca> porque TypeORM devuelve el objeto creado, lo que
  nos permite chequear.
  */
  async crearMarca(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    return this.marcaRepository.save(createMarcaDto)
  }

  /*
  ACTUALIZAR
  */
  async actualizarMarca(id:number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    //Buscamos la marca que tenemos que actualizar
    const marcaOriginal = await this.findOne(id)
    
    //Reemplazamos la marca anterior con la actualizada
    const marcaActualizada = Object.assign(marcaOriginal, updateMarcaDto);
    return this.marcaRepository.save(marcaActualizada)  //No hace falta el await, porque es lo último que hacemos.
  }

  /*
  ELIMINAR
  */
  async eliminarMarca(id:number) {
    //Buscamos si la id existe
    const marcaOriginal = await this.findOne(id);     //await: tenemos que esperar que se resuelva findOne()
    const nombre = marcaOriginal.nombre
    //Si existe, la eliminamos. 
    await this.marcaRepository.remove(marcaOriginal)
    return { message: `Marca ${nombre} eliminada correctamente` };
  }
}
