import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProviders } from './products.providers';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ...productsProviders],
  imports: [UsersModule],
})
export class ProductsModule {}
