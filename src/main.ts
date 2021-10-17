import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const connfigService = app.select(ConfigModule).get(ConfigService);
  await app.listen(connfigService.port);
  console.log(`Application is listening on port ${connfigService.port}.`)
}
bootstrap();
