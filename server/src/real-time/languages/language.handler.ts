import EventEmitter from 'events';
import { Server } from 'socket.io';
import TypedEmitter from 'typed-emitter';
import { ILanguage } from '../../modules/languages/types';
import { EVENTS, ROOMS } from '../real-time.types';
import { LanguageEvents, LANGUAGE_EVENTS } from './language.types';

export const languageEventEmitter = new EventEmitter() as TypedEmitter<LanguageEvents>;

export const registerLanguageHandlers = (io: Server): void => {
  const createLanguage = (payload: ILanguage): void => {
    io.to(ROOMS.AUTH_USERS).emit(EVENTS.MESSAGE, JSON.stringify({ event: LANGUAGE_EVENTS.CREATE, payload: JSON.stringify(payload) }));
  };

  languageEventEmitter.on(LANGUAGE_EVENTS.CREATE, createLanguage);
};
