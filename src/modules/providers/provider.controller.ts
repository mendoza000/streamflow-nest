import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProviderService } from './provider.service';
import { createProviderDto } from './dto/createProvider.dto';
import { UpdateProviderDto } from './dto/updateProvider.dto';

@Controller('providers')
@UseGuards(JwtAuthGuard)
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  create(@Body() dto: createProviderDto, @Req() req) {
    const id: string = req.user.id;
    return this.providerService.create(dto, id);
  }

  @Get()
  getAll(@Req() req) {
    const id: string = req.user.id;
    return this.providerService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.id;
    return this.providerService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProviderDto, @Req() req) {
    const userId: string = req.user.id;
    return this.providerService.update(id, dto, userId);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.id;
    return this.providerService.toggleActive(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.id;
    return this.providerService.remove(id, userId);
  }
}
