import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { AdsModule } from './ads/ads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const hasUrl = !!config.get<string>('DATABASE_URL');
        const host = config.get<string>('DB_HOST', 'localhost');
        const port = parseInt(config.get<string>('DB_PORT', '5432'), 10);
        const username = config.get<string>('DB_USER', 'postgres');
        const password = config.get<string>('DB_PASSWORD') || config.get<string>('DB_PASS', 'postgres');
        const database = config.get<string>('DB_NAME', 'truyen_moi');
        const ssl = config.get<string>('DB_SSL') === 'true' || config.get<boolean>('DB_SSL') === true;

        const sslConfig = ssl ? { rejectUnauthorized: false } : false;

        return hasUrl
          ? {
              type: 'postgres',
              url: config.get<string>('DATABASE_URL'),
              autoLoadEntities: true,
              synchronize: true,
              ssl: sslConfig,
            }
          : {
              type: 'postgres',
              host,
              port,
              username,
              password,
              database,
              autoLoadEntities: true,
              synchronize: true,
              ssl: sslConfig,
            };
      },
    }),
    CatalogModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    AdsModule,
  ],
})
export class AppModule {}
