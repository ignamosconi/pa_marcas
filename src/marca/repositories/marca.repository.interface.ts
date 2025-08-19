import { Marca } from "../marca.entity";
import { CreateMarcaDto } from '../dto/create-marca.dto';
import { UpdateMarcaDto } from '../dto/update-marca.dto';

export interface IMarcaRepository {
  findAll(): Promise<Marca[]>;          //Devolvemos marca porque queremos el dato completo de la BD
                                        //Después en SERVICE: findAll(): Promise<MostrarMarcaCompletaDto[]> {
  findOne(id: number): Promise<Marca | null>;

  findSoftDeleted(): Promise<Marca[]>;

  create(createMarcaDto: CreateMarcaDto): Promise<Marca>;

  update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca>;

  softDelete(id: number): Promise<void>;

  restore(id: number): Promise<void>;
  findOneWithDeleted(id: number): Promise<Marca | null>;
}