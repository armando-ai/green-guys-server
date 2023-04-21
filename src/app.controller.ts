import { Controller, Get } from '@nestjs/common';
import { ResponseStatus } from './modules/interfaces/ResponseStatus';


@Controller()
export class AppController {
  @Get('status')
  getStatus(): ResponseStatus<null> {
    return {
      code: 200,
      message: "OK"
    };
  }


}
