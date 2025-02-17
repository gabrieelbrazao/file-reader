import { Inject, Injectable, Logger } from '@nestjs/common';
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

    await this.sendPeopleToProcess(people);

    return { message: `Processing ${people.length.toLocaleString()} people.` };
  }

  private treatPeopleData(content: string) {
    const lines = content.split('\n');

    lines.shift();

    const people: TPeople = lines
      .map((line) => line.split(','))
      .filter((line) => line.every((field) => field))
      .map(([id, name, phone, state]) => ({ id: +id, name, phone, state }));

    this.removeDuplicatePeople(people);

    return people;
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
