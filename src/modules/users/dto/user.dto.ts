import { Users } from '../entities/user.entity';

export class UserDto {
  id: number;
  username: string;
  role: string;
  deposit?: number;
  token?: string;

  constructor(user: Users) {
    this.id = user.id;
    this.username = user.username;
    this.role = user.role;
    this.deposit = user.deposit;
  }
}
