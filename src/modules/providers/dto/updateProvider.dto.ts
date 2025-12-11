import { IsBoolean, IsOptional } from 'class-validator';
import { createProviderDto } from './createProvider.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProviderDto extends PartialType(createProviderDto) {
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
