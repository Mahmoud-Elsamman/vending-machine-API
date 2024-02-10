import { IsString } from 'class-validator';
import { UserRole } from '../../users/enums/user.role.enum';

export class UserLoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}
