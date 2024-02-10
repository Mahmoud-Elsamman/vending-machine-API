import { Users } from 'src/modules/users/entities/user.entity';
import { Products } from '../entities/product.entity';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class ProductDto {
  id: number;
  amountAvailable: number;
  cost: number;
  productName: string;
  sellerId: number;
  seller?: UserDto;

  constructor(product: Products) {
    this.id = product.id;
    this.amountAvailable = product.amountAvailable;
    this.cost = product.cost;
    this.productName = product.productName;
    this.sellerId = product.sellerId;
    if (product.seller) {
      this.seller = new UserDto(product.seller);
    } else {
      this.seller = null;
    }
  }
}
