import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { auth } from './auth/auth';

@Module({
  imports: [AuthModule.forRoot({ auth }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
