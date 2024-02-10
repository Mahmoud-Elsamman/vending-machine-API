import { PartialType } from '@nestjs/mapped-types';
import { UserRegisterDto } from '../../auth/dto/user-register.dto';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(UserRegisterDto) {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  deposit: number;
}
