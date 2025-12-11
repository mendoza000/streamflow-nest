import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
