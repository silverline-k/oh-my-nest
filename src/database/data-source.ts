import { DataSource } from 'typeorm';
import configuration from 'src/config/configuration';
import { databaseConfigInitializer } from '../config/database/database.config';

const databaseConfig = configuration().database;

export default new DataSource(databaseConfigInitializer(databaseConfig));
