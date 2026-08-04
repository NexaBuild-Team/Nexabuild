import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LandService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.land.findMany();
    }

    findOne(id: string) {
        return this.prisma.land.findUnique({ where: { id } });
    }

    create(data: any) {
        return this.prisma.land.create({ data });
    }

    update(id: string, data: any) {
        return this.prisma.land.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.land.delete({ where: { id } });
    }
}