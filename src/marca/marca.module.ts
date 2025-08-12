import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './marca.entity';
import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,             //3306 para MySQL
      username: 'postgres',   //Ponemos la bd que tengamos, en este caso yo uso la por defecto
      password: '1234',       
      database: 'marcas',
      synchronize: true, // Solo en desarrollo. Deuda técnica.
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Marca]),
  ],
  controllers: [MarcaController],
  providers: [MarcaService]
})
export class MarcaModule {}