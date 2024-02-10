import { IsNumber, IsPositive } from 'class-validator';

export class BuyProductsDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  @IsPositive()
  amount: number;
}
