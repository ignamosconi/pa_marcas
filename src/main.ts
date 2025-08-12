import { NestFactory } from '@nestjs/core';
import { MarcaModule } from './marca/marca.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(MarcaModule, {
    logger: WinstonModule.createLogger({
      transports: [
        // Formato legible en consola (estilo NestJS clásico)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ context, level, timestamp, message }) => {
              const localTime = new Date(timestamp as string).toLocaleString('es-AR', {hour12: false,});
              return `${localTime} [${context}] ${level}: ${message}`;
            }),
          ),
        }),

        // Logs en archivo de texto (informativos)
        new winston.transports.File({
          filename: 'logs/app.log',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),

        // Logs en archivo de errores
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ],
    }),
  });

  // Validaciones de DTOs. Ver comentario en el @Post (creación de marcas)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
