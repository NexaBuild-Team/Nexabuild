import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArchitectureModule } from './architecture/architecture.module';
import { LandModule } from './land/land.module';
import { BuyerModule } from './buyer/buyer.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    PrismaModule,
    PropertyModule, UserModule, AuthModule,
    ArchitectureModule,
    LandModule,
    BuyerModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}