import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from '../config/database/database.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource(databaseConfig(configService));
      return dataSource.initialize();
    },
  },
];
