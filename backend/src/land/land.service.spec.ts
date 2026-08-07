import { Test, TestingModule } from '@nestjs/testing';
import { LandService } from './land.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LandService', () => {
  let service: LandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandService,
        {
          provide: PrismaService,
          useValue: {
            land: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LandService>(LandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
