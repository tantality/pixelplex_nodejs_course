/* eslint-disable no-console */
import * as express from 'express';
import { processError, processNotFoundEndpoint } from './middleware';
import { mountAuthRouter } from './modules/auth/auth.router';
import { mountCardsRouter } from './modules/cards/cards.router';
import { mountLanguagesRouter } from './modules/languages/languages.router';
import { mountTasksRouter } from './modules/tasks/tasks.router';
import { mountUsersRouter } from './modules/users/users.router';
const app = express.default();

app.use(express.json());

mountAuthRouter(app);
mountCardsRouter(app);
mountLanguagesRouter(app);
mountUsersRouter(app);
mountTasksRouter(app);

app.use(processNotFoundEndpoint);
app.use(processError);

async function init(): Promise<void> {
  try {
    await app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
