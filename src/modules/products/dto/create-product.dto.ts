import { IsNumber, IsPositive, IsSemVer, IsString } from 'class-validator';
import {} from 'sequelize-typescript';

export class CreateProductDto {
  @IsNumber()
  @IsPositive()
  amountAvailable: number;
  @IsNumber()
  @IsPositive()
  cost: number;
  @IsString()
  productName: string;
  @IsNumber()
  sellerId?: number;
}
