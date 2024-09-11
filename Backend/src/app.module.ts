import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './module/users.module';
import { AuthModule } from './module/auth.module';
import { TodoModule } from './module/todo.module';
import { getDataSourceOptions } from '../db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available globally
    }),
    TypeOrmModule.forRoot(getDataSourceOptions()), // Call the function to get DataSourceOptions
    UsersModule,
    AuthModule,
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
