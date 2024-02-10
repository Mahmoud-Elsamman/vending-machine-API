import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './modules/users/entities/user.entity';
import { Products } from './modules/products/entities/product.entity';
import { AuthModule } from './modules/auth/auth.module';
require('dotenv').config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      port: 8888,
      models: [Users, Products],
      define: {
        timestamps: false,
      },
      logging: false,
      retryAttempts: 1,
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
  ],
})
export class AppModule {}
