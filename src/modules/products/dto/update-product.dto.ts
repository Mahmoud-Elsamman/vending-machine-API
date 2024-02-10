import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amountAvailable: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost: number;
  @IsOptional()
  @IsString()
  productName: string;
}
