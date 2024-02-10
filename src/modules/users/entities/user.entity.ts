import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { UserRole } from '../enums/user.role.enum';
import { IsEnum } from 'class-validator';

@Table
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  username: string;

  @Column
  password: number;

  @Column({ defaultValue: 0 })
  deposit: number;

  @Column
  @IsEnum(UserRole, {
    message: 'Invalid Role input',
    always: true,
  })
  role: UserRole;
}
