import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { createTypeOrmOptions } from './orm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        await createTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
