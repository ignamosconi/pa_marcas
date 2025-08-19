//ARCHIVO: marca.respository.ts

import { Injectable } from '@nestjs/common';
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
    return this.repo.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: number): Promise<Marca | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findPag(pag: number, mostrar: number): Promise<[Marca[], number]> {
    const skip = (pag - 1) * mostrar;

    return this.repo.findAndCount({
      where: { deletedAt: IsNull() },
      skip,
      take: mostrar,                    //Esto nos devuelve el siguiente vector:
      order: { id: 'ASC' },             //[elementos de la página, cantidad total de resultados (sin paginar)]
    });                                 //Por eso la promesa es Marca[], number.
  }


  async findSoftDeleted(): Promise<Marca[]> {
    return this.repo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
  }

  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    const nueva = this.repo.create(createMarcaDto);
    return this.repo.save(nueva);
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.findOne(id);
    if (!marca) throw new Error('Marca no encontrada');

    const actualizada = Object.assign(marca, updateMarcaDto);
    return this.repo.save(actualizada);
  }

  async softDelete(id: number): Promise<void> {
    const marca = await this.findOne(id);      //await: tenemos que esperar que se resuelva findOne()
    if (!marca) throw new Error('Marca no encontrada');
    await this.repo.softRemove(marca);
  }

  async restore(id: number): Promise<void> {
    await this.repo.restore(id);
  }

  async findOneWithDeleted(id: number): Promise<Marca | null> {
    return this.repo.findOne({ where: { id }, withDeleted: true });
  }
}