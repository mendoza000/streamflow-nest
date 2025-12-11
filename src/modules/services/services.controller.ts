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
import { CreateServiceDto } from './dto/createService.dto';
import { UpdateServiceDto } from './dto/updateService.dto';
import { ServicesService } from './services.service';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: CreateServiceDto, @Req() req) {
    const id: string = req.user.id;
    return this.servicesService.create(dto, id);
  }

  @Get()
  getAll(@Req() req) {
    const id: string = req.user.id;
    return this.servicesService.findAll(id);
  }

  @Get('stats')
  getStats(@Req() req) {
    const id: string = req.user.id;
    return this.servicesService.getStats(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.id;
    return this.servicesService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto, @Req() req) {
    const userId: string = req.user.id;
    return this.servicesService.update(id, dto, userId);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.id;
    return this.servicesService.toggleActive(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.id;
    return this.servicesService.remove(id, userId);
  }
}
