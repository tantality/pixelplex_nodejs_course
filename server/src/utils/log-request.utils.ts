/* eslint-disable no-console */
import { Request } from 'express';

export const logRequest = <T>(req: T): void => {
  const { body, query, params } = req as Request;
  if (Object.keys(body).length) {
    console.log('body: ', body);
  }
  if (Object.keys(query).length) {
    console.log('query: ', query);
  }
  if (Object.keys(params).length) {
    console.log('params: ', params);
  }
};
