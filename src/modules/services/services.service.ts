import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/createService.dto';
import { UpdateServiceDto } from './dto/updateService.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServiceDto, userId: string) {
    const existingService = await this.prisma.service.findFirst({
      where: { name: dto.name, userId },
    });

    if (existingService) {
      throw new ConflictException('Service with this name already exists');
    }

    return this.prisma.service.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.service.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, userId },
      include: {
        accounts: {
          select: {
            id: true,
            email: true,
            status: true,
            availableScreens: true,
            totalScreens: true,
            expirationDate: true,
          },
        },

        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });

    if (!service) {
      throw new ConflictException('Service not found');
    }

    // Calcular estadísticas
    const totalAccounts = service.accounts.length;
    const availableAccounts = service.accounts.filter(
      (acc) => acc.status === 'AVAILABLE' && acc.availableScreens > 0,
    ).length;
    const soldOutAccounts = service.accounts.filter(
      (acc) => acc.status === 'SOLD',
    ).length;
    const totalScreensAvailable = service.accounts.reduce(
      (sum, acc) => sum + acc.availableScreens,
      0,
    );

    return {
      ...service,
      stats: {
        totalAccounts,
        availableAccounts,
        soldOutAccounts,
        totalScreensAvailable,
      },
    };
  }

  async update(id: string, dto: UpdateServiceDto, userId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, userId },
    });

    if (!service) {
      throw new ConflictException('Service not found');
    }

    if (dto.name && dto.name !== service.name) {
      const existingService = await this.prisma.service.findFirst({
        where: { name: dto.name, userId, id: { not: id } },
      });

      if (existingService) {
        throw new ConflictException('Service with this name already exists');
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { accounts: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check if it has associated accounts
    if (service._count.accounts > 0) {
      throw new BadRequestException(
        'You cannot delete a service with associated accounts. Please deactivate it instead.',
      );
    }

    // Permanently delete if it has no accounts
    await this.prisma.service.delete({
      where: { id },
    });

    return { message: 'Service deleted successfully' };
  }

  async toggleActive(id: string, userId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, userId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        isActive: !service.isActive,
      },
    });
  }

  async getStats(userId: string) {
    const services = await this.prisma.service.findMany({
      where: { userId },
      include: {
        accounts: true,
      },
    });

    const stats = services.map((service) => {
      const totalAccounts = service.accounts.length;
      const availableScreens = service.accounts.reduce(
        (sum, acc) => sum + acc.availableScreens,
        0,
      );
      const soldOutAccounts = service.accounts.filter(
        (acc) => acc.status === 'SOLD',
      ).length;

      return {
        serviceName: service.name,
        totalAccounts,
        availableScreens,
        soldOutAccounts,
        revenue: 0, // Calculate later with sales
      };
    });

    return {
      totalServices: services.length,
      activeServices: services.filter((s) => s.isActive).length,
      services: stats,
    };
  }
}
