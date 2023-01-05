import http from 'http';
import { Server, Socket } from 'socket.io';
import { registerLanguageHandlers } from './languages/language.handler';
import { isAuth } from './middleware';
import { IO_SERVER_OPTIONS } from './real-time.constants';
import { ROOMS } from './real-time.types';

const onConnection = (socket: Socket): void => {
  socket.join(ROOMS.AUTH_USERS);
};

const initSocket = (server: http.Server): void => {
  const io = new Server(server, IO_SERVER_OPTIONS);
  io.use(isAuth);
  io.on('connection', onConnection);

  registerLanguageHandlers(io);
};

export { initSocket };
