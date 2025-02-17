import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from '../people.service';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { of } from 'rxjs';
import {
  duplicatePeople,
  fileWithNoPeople,
  fileWithPerson,
  mockedPerson,
  noPeopleContent,
  peopleMultipleChunks,
} from '../mocks/people.service.mock';

describe('PeopleService', () => {
  let service: PeopleService;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: 'PEOPLE_SERVICE',
          useValue: {
            emit: jest.fn(() => of({})),
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    clientProxy = module.get<ClientProxy>('PEOPLE_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPeopleDataFromCsv', () => {
    it('should process people data from CSV', async () => {
      const result = await service.processPeopleDataFromCsv(fileWithPerson);

      expect(result).toEqual({ message: 'Processing 1 people.' });
    });

    it('should throw ServiceUnavailableException on error', async () => {
      jest.spyOn(service, 'sendPeopleToProcess').mockRejectedValue(new Error());

      await expect(
        service.processPeopleDataFromCsv(fileWithPerson),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('should throw NotFoundException if no people to process', async () => {
      await expect(
        service.processPeopleDataFromCsv(fileWithNoPeople),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('treatPeopleData', () => {
    it('should treat people data correctly', () => {
      const result = (service as any).treatPeopleData(mockedPerson.content);

      expect(result).toEqual(mockedPerson.json);
    });

    it('should throw NotFoundException if no people to process', () => {
      expect((): any =>
        (service as any).treatPeopleData(noPeopleContent),
      ).toThrow(NotFoundException);
    });
  });

  describe('removeDuplicatePeople', () => {
    it('should remove duplicate people', () => {
      const result = (service as any).removeDuplicatePeople(duplicatePeople);

      expect(result).toEqual([duplicatePeople[0]]);
    });
  });

  describe('sendPeopleToProcess', () => {
    it('should send people to process in chunks', async () => {
      jest.spyOn(clientProxy, 'emit').mockReturnValue(of({}));

      await service.sendPeopleToProcess(peopleMultipleChunks);

      expect(clientProxy.emit).toHaveBeenCalledTimes(2);
    });
  });
});
