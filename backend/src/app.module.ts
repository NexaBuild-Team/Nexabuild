import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { ConstructionModule } from './construction/construction.module';



@Module({
  imports: [PrismaModule, PropertyModule, ConstructionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }