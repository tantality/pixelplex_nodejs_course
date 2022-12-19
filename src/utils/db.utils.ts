/* eslint-disable no-console */
import { DataSource } from 'typeorm';

export const connectToDb = async (AppDataSource: DataSource): Promise<DataSource> => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
  return AppDataSource;
}; 
