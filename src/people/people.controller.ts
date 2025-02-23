import {
  Controller,
  FileTypeValidator,
  HttpCode,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post('ProcessFromCsv')
  @HttpCode(202)
  @UseInterceptors(FileInterceptor('file'))
  ProcessPeopleDataFromCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.peopleService.processPeopleDataFromCsv(file);
  }
}
