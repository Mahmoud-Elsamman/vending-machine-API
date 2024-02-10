import { IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../users/enums/user.role.enum';

export class UserRegisterDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsEnum(UserRole)
  role: UserRole;
}
