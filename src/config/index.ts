import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Language } from '../modules/languages/language.entity';
import * as Migrations from '../migrations';
import { Token } from '../modules/auth/token.entity';

dotenv.config();

export const DB: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'flashcards',
  synchronize: true,
  logging: false,
  entities: [Language, User, Token],
  migrations: Object.values(Migrations),
  migrationsRun: true,
};

export const config = {
  DEV: {
    PORT: 8080,
    DB,
  },
};
