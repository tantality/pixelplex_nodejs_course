/* eslint-disable no-console */
import { DataSource, DataSourceOptions } from 'typeorm';

export const connectToDb = async (options: DataSourceOptions): Promise<DataSource> => {
  const AppDataSource = new DataSource(options);
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
  return AppDataSource;
};
