//ARCHIVO: marca.respository.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Marca } from '../marca.entity';
import { CreateMarcaDto } from '../dto/create-marca.dto';
import { UpdateMarcaDto } from '../dto/update-marca.dto';
import { IMarcaRepository } from './marca.repository.interface';

@Injectable()
//Nuestro repositorio usará las funciones de la interfaz
export class MarcaRepository implements IMarcaRepository {
    /* 
        Nuestro repositorio es el que interactuará con TypeORM, y no el service (como teníamos antes)
        A través de TypeORM, injectamos el repositorio de Marca que creamos con PSQL (cuya conexión
        definimos en el archivo marca.module.ts). 
        A través de marcaRepository, podremos acceder a múltiples métodos:
        • find  • findOne   • save    • delete
    */
    constructor(
    @InjectRepository(Marca)
    private readonly repo: Repository<Marca>,
  ) {}

  async findAll(): Promise<Marca[]> {
    try {
      return this.repo.find({
      where: { deletedAt: IsNull() },
    });
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar todas las marcas. Error:' + error);
    }
    
  }

  async findOne(id: number): Promise<Marca | null> {
    try {
      return this.repo.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(`Error al buscar la marca con ID ${id}. Error:` + error);
    }
  }

  async findPag(pag: number, mostrar: number): Promise<[Marca[], number]> {
    const skip = (pag - 1) * mostrar;   // No nos interesa atrapar errores de esta cte, sino del ORM.

    try {
      return this.repo.findAndCount({
      where: { deletedAt: IsNull() },
      skip,
      take: mostrar,                    //Esto nos devuelve el siguiente vector:
      order: { id: 'ASC' },             //[elementos de la página, cantidad total de resultados (sin paginar)]
    });                                 //Por eso la promesa es Marca[], number.

    } catch (error) {
      throw new InternalServerErrorException(`Error al paginar las marcas. Error:` + error);
    }
  }


  async findSoftDeleted(): Promise<Marca[]> {
    try {
      return this.repo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar marcas eliminadas. Error:' + error);
    }
  }

  //Usaremos este nombre para evitar repetidos. 
  async findByNombreInsensitive(nombre: string): Promise<Marca | null> {
  try {
    return this.repo
      .createQueryBuilder('marca')
      .where('LOWER(marca.nombre) = LOWER(:nombre)', { nombre })
      .withDeleted() // Opcional, depende si querés incluir soft deletes
      .getOne();
  } catch (error) {
    throw new InternalServerErrorException(`Error al buscar marca por nombre. Error: ${error}`);
  }
}


  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    try {
      const nueva = this.repo.create(createMarcaDto);
      return this.repo.save(nueva);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la marca. Error:' + error)
    }
    
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    try {
      const marca = await this.findOne(id);
      if (!marca) {
        throw new NotFoundException('Marca no encontrada');
      }
      const actualizada = Object.assign(marca, updateMarcaDto);
      return this.repo.save(actualizada);
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error al actualizar la marca con ID ${id}. Error:` + error);
    }
  }

  async softDelete(id: number): Promise<void> {
    try {
      const marca = await this.findOne(id);      //await: tenemos que esperar que se resuelva findOne()
      if (!marca) {
        throw new NotFoundException('Marca no encontrada');
      }
      await this.repo.softRemove(marca);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error al eliminar (soft-delete) la marca con ID ${id}. Error:` + error);
    }
  }

  async restore(id: number): Promise<void> {
    try {
      await this.repo.restore(id);
    } catch (error) {
      throw new InternalServerErrorException(`Error al restaurar la marca con ID ${id}. Error: ` + error);
    }
  }

  async findOneWithDeleted(id: number): Promise<Marca | null> {
    try {
      return this.repo.findOne({ where: { id }, withDeleted: true });
    } catch (error) {
      throw new InternalServerErrorException(`Error al buscar (incluyendo eliminadas) la marca con ID ${id}. Error: ` + error);
    }
  }
}