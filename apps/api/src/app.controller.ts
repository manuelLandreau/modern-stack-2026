import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  @Get()
  @AllowAnonymous()
  getHealth() {
    return { message: 'Welcome to CTest API' };
  }
}
