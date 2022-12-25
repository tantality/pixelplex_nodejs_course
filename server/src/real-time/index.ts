import http from 'http';
import { Server } from 'socket.io';
import { registerLanguageHandlers } from './language/language.handler';
import { IO_SERVER_OPTIONS } from './real-time.constants';

const initSocket = (server: http.Server): void => {
  const io = new Server(server, IO_SERVER_OPTIONS);
  registerLanguageHandlers(io);
};

export { initSocket };
