import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from '../people.controller';
import { PeopleService } from '../people.service';
import {
  fileWithNoPeople,
  fileWithPerson,
} from '../mocks/people.controller.mock';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';

describe('PeopleController', () => {
  let controller: PeopleController;
  let peopleService: PeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        {
          provide: PeopleService,
          useValue: {
            processPeopleDataFromCsv: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    peopleService = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ProcessPeopleDataFromCsv', () => {
    it('should process people data from CSV', async () => {
      jest.spyOn(peopleService, 'processPeopleDataFromCsv').mockResolvedValue({
        message: 'Processing 1 people.',
      });

      const result = await controller.ProcessPeopleDataFromCsv(fileWithPerson);

      expect(result).toEqual({ message: 'Processing 1 people.' });
      expect(peopleService.processPeopleDataFromCsv).toHaveBeenCalledWith(
        fileWithPerson,
      );
    });

    it('should throw ServiceUnavailableException on error', async () => {
      jest
        .spyOn(peopleService, 'processPeopleDataFromCsv')
        .mockRejectedValue(new ServiceUnavailableException());

      await expect(
        controller.ProcessPeopleDataFromCsv(fileWithPerson),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('should throw NotFoundException if no people to process', async () => {
      jest
        .spyOn(peopleService, 'processPeopleDataFromCsv')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.ProcessPeopleDataFromCsv(fileWithNoPeople),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
