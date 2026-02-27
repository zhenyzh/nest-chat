import {Controller, Get} from '@nestjs/common';
import type {AppService} from './app.service';

@Controller('/api')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/users')
  getUsers() {
    return this.appService.getUsers();
  }
}
