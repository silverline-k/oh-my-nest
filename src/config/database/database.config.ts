import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from '../config.validation';

const databaseConfigInitializer = (
  databaseConfig: DatabaseConfig
): DataSourceOptions => {
  return {
    type: databaseConfig.type as any,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
    synchronize: databaseConfig.synchronize,
    logging: databaseConfig.logging,
  };
};

const databaseConfig = (configService: ConfigService) => {
  const databaseConfig = configService.get<DatabaseConfig>('database');

  return databaseConfigInitializer(databaseConfig);
};

export { databaseConfigInitializer, databaseConfig };
