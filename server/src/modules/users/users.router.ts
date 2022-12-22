import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { isAuth, validatePayload } from '../../middleware';
import { UpdateUserRequest } from './types';
import { UsersController } from './users.controller';
import { UsersValidation } from './users.validation';

const router = Router();

router.patch(
  '/',
  checkSchema(UsersValidation.updateUser),
  validatePayload<UpdateUserRequest>,
  isAuth<UpdateUserRequest>,
  UsersController.updateUser,
);

export function mountUsersRouter(app: Application): void {
  app.use('/api/v1/users', router);
}
