//ARCHIVO: marca.validator.ts
/* 
    marca.service tendrá la lógica de negocio pura, mientras que marca.validator tendrá las validaciones
    que el service puede llegar a necesitar. 
    
    Diferencia con helper:
        • HELPER: Realiza formateos o cálculos puros. No tiene dependencias.
        • VALIDATOR: Tiene acceso a la base de datos y es un provider que debe listarse en marca.module,
                     (al igual que un repository, service, etc). 
*/

import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { MarcaRepository } from '../repositories/marca.repository';
import { Marca } from '../marca.entity';


@Injectable()
export class MarcaValidator {
  constructor(
    @Inject('IMarcaRepository')
    private readonly marcaRepository: MarcaRepository,
    ) {}

    /*
    Valida que no exista otra marca con el mismo nombre, con case insensitive (mcdonalds = McDonalds),
    salvo que sea la misma id (por ejemplo, si se actualiza la marca y el nombre no cambia).

    Esta función va a reutilizarse al momento de crear y al momento de actualizar marcas. 
    - CREAR: Cuando creamos marcas, validamos solo que no exista el nombre. No validamos la ID porque
             al tener todavía que crear el objeto, no tenemos una ID.

    - ACTUALIZAR: Se pasa el ID actual para permitir que el mismo nombre sea válido si pertenece a la
                 misma marca.
    */

    //Chequeamos en la BD si existe el nombre. Si salta la exception el resto del código NO se ejecuta.
    async validarNombreUnico(nombre: string, idActual?: number): Promise<void> {
        const existente = await this.marcaRepository.findByNombreInsensitive(nombre);
        if (existente && existente.id !== idActual) {
            throw new BadRequestException(`Ya existe una marca con el nombre ${nombre} (case insensitive).`);
        }
    }

    async validarExistencia(id: number): Promise<Marca> {
        const marca = await this.marcaRepository.findOne(id);
        if (!marca) {
            throw new NotFoundException(`No se encontró la marca con ID ${id}`);
        }
        return marca;
    }

    // Buscar todas las marcas, soft-deleteds o no. Error: La marca directamente no existe
    async validarExistenciaConSoftDeleted(id: number): Promise<Marca> {
        const marca = await this.marcaRepository.findOneWithDeleted(id);
        if (!marca) {
            throw new NotFoundException(`No existe una marca con ID ${id}`);
        }
        return marca;
    }

    //Si se encontró la marca, tenemos que validar si está soft-deleted (sino, no hay nada que restaurar)
    async validarMarcaEstaSoftDeleted(marca: Marca): Promise<void> {
        if (!marca.deletedAt) {
            throw new BadRequestException(`La marca con ID ${marca.id} no está eliminada.`);
        }
    }
}