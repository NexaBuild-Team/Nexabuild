import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.property.findMany({
      include: { agent: true },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: { agent: true },
    });
    if (!property) throw new NotFoundException(`Property with id "${id}" not found`);
    return property;
  }

  async create(data: any) {
    return this.prisma.property.create({ data });
  }

  async update(id: string, data: any) {
    await this.findOne(id); // ensures 404 if not found
    return this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id); // ensures 404 if not found
    return this.prisma.property.delete({ where: { id } });
  }
}