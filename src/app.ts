import * as express from 'express';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { processError, processNotFoundEndpoint } from './middleware';
import { mountAuthRouter } from './modules/auth/auth.router';
import { mountCardsRouter } from './modules/cards/cards.router';
import { mountLanguagesRouter } from './modules/languages/languages.router';
import { mountTasksRouter } from './modules/tasks/tasks.router';
import { mountUsersRouter } from './modules/users/users.router';
const app = express.default();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

mountAuthRouter(app);
mountCardsRouter(app);
mountLanguagesRouter(app);
mountUsersRouter(app);
mountTasksRouter(app);

app.use(processNotFoundEndpoint);
app.use(processError);

export { app }; 
