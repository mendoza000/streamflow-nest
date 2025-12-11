import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createProviderDto } from './dto/createProvider.dto';
import type { UpdateProviderDto } from './dto/updateProvider.dto';

@Injectable()
export class ProviderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: createProviderDto, userId: string) {
    const existingProvider = await this.prisma.provider.findFirst({
      where: { name: dto.name, userId },
    });

    if (existingProvider) {
      throw new ConflictException('Provider with this name already exists');
    }

    return this.prisma.provider.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.provider.findMany({
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
    const provider = await this.prisma.provider.findFirst({
      where: { id, userId },
      include: {
        accounts: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            email: true,
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

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async update(id: string, dto: UpdateProviderDto, userId: string) {
    const provider = await this.prisma.provider.findFirst({
      where: { id, userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    if (dto.name && dto.name !== provider.name) {
      const existingProvider = await this.prisma.provider.findFirst({
        where: { name: dto.name, userId },
      });

      if (existingProvider) {
        throw new ConflictException('Provider with this name already exists');
      }
    }

    return this.prisma.provider.update({
      where: { id },
      data: dto,
    });
  }

  async toggleActive(id: string, userId: string) {
    const provider = await this.prisma.provider.findFirst({
      where: { id, userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return this.prisma.provider.update({
      where: { id },
      data: { isActive: !provider.isActive },
    });
  }

  async remove(id: string, userId: string) {
    const provider = await this.prisma.provider.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { accounts: true },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Check if it has associated accounts
    if (provider._count.accounts > 0) {
      throw new ConflictException(
        'You cannot delete a provider with associated accounts. Please deactivate it instead.',
      );
    }

    // Permanently delete if it has no accounts
    await this.prisma.provider.delete({
      where: { id },
    });

    return { message: 'Provider deleted successfully' };
  }
}
