import { IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @IsOptional()
  @Column({ nullable: true })   //Como pusimos el @IsOptional(), existe la posibilidad que sea null.
  descripcion: string;
}