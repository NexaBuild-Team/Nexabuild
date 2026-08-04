import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { LandModule } from './land/land.module';

@Module({
  imports: [PrismaModule, PropertyModule, LandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }