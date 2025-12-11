import { IsOptional, IsString } from 'class-validator';

export class createProviderDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  notes: string;
}
