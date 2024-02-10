import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BuyProductsDto } from './dto/buy-products.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../users/enums/user.role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.SELLER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Roles(UserRole.SELLER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(+id, updateProductDto, req.user.sub);
  }

  @Roles(UserRole.SELLER)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productsService.remove(+id, req.user.sub);
  }

  @Roles(UserRole.BUYER)
  @Post('/buy')
  buyProducts(@Body() buyProductsDto: BuyProductsDto, @Request() req) {
    return this.productsService.buyProducts(buyProductsDto, req.user.sub);
  }
}
