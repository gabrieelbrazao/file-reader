import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'PEOPLE_SERVICE',
        useFactory: (configService: ConfigService) => {
          const amqpUrl = configService.get<string>('AMQP_URL');
          const queueName = configService.get<string>('QUEUE_NAME');

          if (!amqpUrl || !queueName)
            throw new Error('AMQP information is missing');

          return {
            transport: Transport.RMQ,
            options: {
              urls: [amqpUrl],
              queue: queueName,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
