import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
// Controller: handles incoming HTTP requests and returns responses, delegating business logic to the AppService.
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Endpoint: returns a greeting message from the AppService when a GET request is made to the root URL.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
