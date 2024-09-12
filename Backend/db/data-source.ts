import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const getDataSourceOptions = (): DataSourceOptions => {
  const configService = new ConfigService();

  return {
    type: 'mysql',
    host: configService.get('DB_HOST') || 'localhost',
    port: +configService.get('DB_PORT') || 3306,
    username: configService.get('DB_USERNAME') || 'root',
    password: configService.get('DB_PASSWORD') || 'root',
    database: configService.get('DB_DATABASE') || 'todo_db',
    entities: ['dist/**/*.entity.js'], // Ensure .js is used in production
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    migrationsRun: true, // Automatically runs pending migrations on application startup
  };
};

const dataSource = new DataSource(getDataSourceOptions());
export default dataSource;
