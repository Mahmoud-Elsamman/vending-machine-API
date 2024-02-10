import { Users } from '../users/entities/user.entity';
import { Products } from './entities/product.entity';

export const productsProviders = [
  {
    provide: 'PRODUCTS_REPOSITORY',
    useValue: Products,
  },
  {
    provide: 'USERS_REPOSITORY',
    useValue: Users,
  },
];
