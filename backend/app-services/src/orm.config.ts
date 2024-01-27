import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity';

export const createTypeOrmOptions = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  port: parseInt(configService.get('DB_PORT'), 10) || 5432,
  host: configService.get('DB_HOST') || 'localhost',
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User],
  synchronize: true,
});
export const config = {
  useFactory: async (configService: ConfigService) =>
    await createTypeOrmOptions(configService),
  inject: [ConfigService],
};
