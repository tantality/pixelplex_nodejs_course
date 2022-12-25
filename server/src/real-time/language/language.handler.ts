import EventEmitter from 'events';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import TypedEmitter from 'typed-emitter';
import { ILanguage } from '../../modules/languages/types';
import { LanguageEvents, LANGUAGE_EVENTS } from './language.types';

export const languageEventEmitter = new EventEmitter() as TypedEmitter<LanguageEvents>;

export const registerLanguageHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void => {
  const creatingLanguage = (payload: ILanguage): void => {
    io.sockets.sockets.forEach((client) =>
      client.send(JSON.stringify({ event: LANGUAGE_EVENTS.CREATING, payload: JSON.stringify(payload) })),
    );
  };

  languageEventEmitter.on(LANGUAGE_EVENTS.CREATING, creatingLanguage);
};
