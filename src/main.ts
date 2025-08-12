import { NestFactory } from '@nestjs/core';
import { MarcaModule } from './marca/marca.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MarcaModule);

  //Validaciones de DTOs (ver comentario en el Post para crear marcas)
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
