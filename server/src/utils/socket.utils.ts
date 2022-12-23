/* eslint-disable no-console */
import { EventEmitter } from 'events';
import http from 'http';
import TypedEmitter from 'typed-emitter';
import { Server } from 'socket.io';
import { ILanguage } from '../modules/languages/types';

type MessageEvents = {
  'creating-language': (payload: ILanguage) => void;
};

const messageEmitter = new EventEmitter() as TypedEmitter<MessageEvents>;

const initSocket = (server: http.Server): void => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    socket.on('disconnect', console.error);
  });

  messageEmitter.on('creating-language', (payload: ILanguage) => {
    io.sockets.sockets.forEach((client) => client.send(JSON.stringify({ event: 'creating-language', payload: JSON.stringify(payload) })));
  });
};

export { messageEmitter, initSocket };
