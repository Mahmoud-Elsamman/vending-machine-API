import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/product.entity';
import { ProductDto } from './dto/product.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Users } from '../users/entities/user.entity';
import { BuyProductsDto } from './dto/buy-products.dto';
import { UserRole } from '../users/enums/user.role.enum';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private productsRepository: typeof Products,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof Users,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { sellerId } = createProductDto;

      const user = await this.usersRepository.findByPk(sellerId);

      if (!user || user.role != UserRole.SELLER) {
        throw new HttpException('Invalid Seller Data', HttpStatus.NOT_FOUND);
      }

      const product = await this.productsRepository.create({
        ...createProductDto,
      });

      return new ProductDto(product);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    const products = await this.productsRepository.findAndCountAll({
      include: [Users],
    });

    return products.rows.map((product) => {
      return new ProductDto(product);
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findByPk(id, {
      include: [Users],
    });

    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    return new ProductDto(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    try {
      const product = await this.findOne(id);

      if (userId === product.sellerId) {
        await this.productsRepository.update(updateProductDto, {
          where: { id },
        });

        return this.findOne(product.id);
      } else {
        throw new HttpException('Invalid Seller data', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const product = await this.findOne(id);

      if (userId === product.sellerId) {
        await this.productsRepository.destroy({
          where: { id },
          force: true,
        });

        return await this.findAll();
      } else {
        throw new HttpException('Invalid Seller data', HttpStatus.BAD_REQUEST);
      }
    } catch (exception: any) {
      throw new HttpException(exception.message, HttpStatus.BAD_REQUEST);
    }
  }

  async buyProducts(buyProductsDto: BuyProductsDto, userId: number) {
    const { productId, amount } = buyProductsDto;
    const product = await this.productsRepository.findByPk(productId);
    const user = await this.usersRepository.findByPk(userId);

    if (!user || !product) {
      throw new HttpException(
        'User or Product not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (product.amountAvailable < amount) {
      throw new HttpException('Product out of stock', HttpStatus.BAD_REQUEST);
    }

    const totalCost = product.cost * amount;

    if (user.deposit < totalCost) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    user.deposit -= totalCost;
    product.amountAvailable -= amount;

    const change = this.calculateChange(user.deposit);

    user.deposit = 0;

    await user.save();
    await product.save();

    return {
      totalSpent: totalCost,
      products: { name: product.productName, price: product.cost, amount },
      change,
    };
  }

  private calculateChange(remainingDeposit: number): number[] {
    const changeDenominations = [100, 50, 20, 10, 5];

    const change: number[] = [];

    changeDenominations.map((coin) => {
      const count = Math.floor(remainingDeposit / coin);
      remainingDeposit -= count * coin;
      for (let i = 1; i <= count; i++) {
        change.push(coin);
      }
    });

    return change;
  }
}
