import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), PeopleModule],
})
export class AppModule {}
