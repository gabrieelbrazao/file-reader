import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PeopleModule } from '../people.module';
import { ConfigModule } from '@nestjs/config';
import { PeopleService } from '../people.service';
import { App } from 'supertest/types';

describe('PeopleController (e2e)', () => {
  let app: INestApplication;
  const peopleService = { processPeopleDataFromCsv: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), PeopleModule],
    })
      .overrideProvider(PeopleService)
      .useValue(peopleService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/people/ProcessFromCsv (POST) should process people data from CSV', () => {
    const fileBuffer = Buffer.from(
      'id,name,phone,state\n1,John Doe,1234567890,CA',
    );

    peopleService.processPeopleDataFromCsv.mockResolvedValue({
      message: 'Processing 1 people.',
    });

    return request(app.getHttpServer() as App)
      .post('/people/ProcessFromCsv')
      .attach('file', fileBuffer, 'people.csv')
      .expect(202)
      .expect({
        message: 'Processing 1 people.',
      });
  });

  it('/people/ProcessFromCsv (POST) should return 400 for invalid file type', () => {
    return request(app.getHttpServer() as App)
      .post('/people/ProcessFromCsv')
      .attach('file', Buffer.from('invalid content'), 'people.txt')
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
