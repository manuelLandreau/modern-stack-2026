import { Controller, Get } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('user')
export class UserController {
  @Get('me')
  getMe(@Session() session: UserSession) {
    return { user: session.user };
  }
}
