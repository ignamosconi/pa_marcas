import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarcaModule } from './marca/marca.module';

@Module({
  imports: [MarcaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}