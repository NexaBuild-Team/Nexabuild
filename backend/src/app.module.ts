import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { ArchitectureModule } from './architecture/architecture.module';



@Module({
  imports: [PrismaModule, PropertyModule, ArchitectureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }