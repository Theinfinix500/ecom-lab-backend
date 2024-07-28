import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  console.log('Seeding started...');
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seederService = appContext.get(SeederService);
  await seederService.seed();
  console.log('Seeding completed!');
  await appContext.close();
}

bootstrap().catch(error => {
  console.error('Seeding failed:', error);
});
