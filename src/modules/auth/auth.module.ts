import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { usersProviders } from './auth.providers';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...usersProviders],
})
export class AuthModule {}
