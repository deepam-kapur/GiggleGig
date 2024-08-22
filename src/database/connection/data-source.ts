import 'reflect-metadata';

import { DataSource } from 'typeorm';

import Config from '../../config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: Config.DB.HOST,
  port: Config.DB.PORT,
  username: Config.DB.USERNAME,
  password: Config.DB.PASSWORD,
  database: Config.DB.DATABASE,
  synchronize: true,
  logging: Config.LOGS,
  entities: [`${__dirname}/../entity/*{.js,.ts}`],
  migrations: [],
  subscribers: [],
});
