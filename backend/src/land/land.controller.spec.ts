import { Test, TestingModule } from '@nestjs/testing';
import { LandController } from './land.controller';
import { LandService } from './land.service';

describe('LandController', () => {
  let controller: LandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandController],
      providers: [
        {
          provide: LandService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LandController>(LandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
