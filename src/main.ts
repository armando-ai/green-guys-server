import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: `https://green-guys-landscaping.vercel.app`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });
  const port = process.env.PORT || 4000;

  await app.listen(port, "0.0.0.0");

}
bootstrap();
