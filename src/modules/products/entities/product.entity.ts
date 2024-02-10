import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Users } from 'src/modules/users/entities/user.entity';

@Table
export class Products extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  amountAvailable: number;

  @Column
  cost: number;

  @Column
  productName: string;

  @ForeignKey(() => Users)
  @Column
  sellerId: number;

  @BelongsTo(() => Users)
  seller?: Users;
}
