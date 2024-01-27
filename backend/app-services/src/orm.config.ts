import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  port: 5432,
  host: 'localhost',
  username: 'postgres',
  password: 'admin',
  database: 'ecommerce',
  entities: [User],
  synchronize: true,
};
