/* eslint-disable no-console */
import http from 'http';
import { DataSource } from 'typeorm';
import { app } from './app';
import { config } from './config';
import AppDataSource from './data-source';
import { initSocket } from './real-time';
import { connectToDb } from './utils';

let dbConnection: DataSource;
async function init(): Promise<void> {
  try {
    dbConnection = await connectToDb(AppDataSource);
    const server = http.createServer(app);

    initSocket(server);

    server.listen(config.DEV.PORT, () => console.log(`Listening ${config.DEV.PORT}`));
  } catch (error) {
    console.log(error);
    dbConnection.destroy();
    process.exit(1);
  }
}

init();
