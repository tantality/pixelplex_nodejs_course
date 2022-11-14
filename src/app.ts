/* eslint-disable no-console */
import * as express from 'express';
import { processError, processNotFoundEndpoint } from './middleware';
import { mountAuthRouter } from './resources/auth/auth.router';
import { mountCardsRouter } from './resources/cards/cards.router';
import { mountLanguagesRouter } from './resources/languages/languages.router';
import { mountTasksRouter } from './resources/tasks/tasks.router';
import { mountUsersRouter } from './resources/users/users.router';
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
