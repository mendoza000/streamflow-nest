import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateServiceDto } from './createService.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
