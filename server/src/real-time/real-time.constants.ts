import { ServerOptions } from 'socket.io';

export const IO_SERVER_OPTIONS: Partial<ServerOptions> = { cors: { origin: '*' } };
