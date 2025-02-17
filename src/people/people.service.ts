import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TPeople } from './types';

@Injectable()
export class PeopleService {
  constructor(@Inject('PEOPLE_SERVICE') private rabbitClient: ClientProxy) {}

  private readonly logger = new Logger(PeopleService.name);

  async processPeopleDataFromCsv(file: Express.Multer.File) {
    const content = file.buffer.toString();

    const people = this.treatPeopleData(content);

    try {
      await this.sendPeopleToProcess(people);

      return {
        message: `Processing ${people.length.toLocaleString()} people.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ServiceUnavailableException('Error processing people data');
    }
  }

  private treatPeopleData(content: string) {
    const lines = content.split('\n');

    lines.shift();

    if (lines.length === 0) {
      this.logger.log('No people to process');
      this.logger.debug(content);

      throw new NotFoundException('No people to process');
    }

    const people: TPeople = lines
      .map((line) => line.split(','))
      .filter((line) => line.every((field) => field))
      .map(([id, name, phone, state]) => ({ id: +id, name, phone, state }));

    const uniquePeople = this.removeDuplicatePeople(people);

    return uniquePeople;
  }

  private removeDuplicatePeople(people: TPeople) {
    return people.filter(
      (person, index, self) =>
        index === self.findIndex((t) => t.id === person.id),
    );
  }

  async sendPeopleToProcess(people: TPeople) {
    const chunkSize = 1_000;
    const secondsBetweenChunks = 1;

    for (let i = 0; i < people.length; i += chunkSize) {
      const chunk = people.slice(i, i + chunkSize);

      this.logger.log(`Sending ${chunk.length} people to be processed`);

      await lastValueFrom(this.rabbitClient.emit('processed-people', chunk));

      await new Promise((resolve) =>
        setTimeout(resolve, secondsBetweenChunks * 1_000),
      );
    }
  }
}
