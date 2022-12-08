/* eslint-disable require-await */
import { Request } from 'express';
import normalizeEmail from 'normalize-email';
import * as bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { logRequest } from '../../utils';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthDTO } from './auth.dto';
import { LogInBody, SignUpBody } from './types';
import { JWTService } from './jwt.service';

const user = new User();
user.id = 1;
user.name = 'Angelina';
user.email = 'email@gmail.com';
user.normalizedEmail = 'email@gmail.com';
user.password = 'qwerty123';
user.role = 'user';
user.refreshToken = 'awdwkmkwad243';
user.createdAt = new Date();
user.updatedAt = new Date();
const authDTO = new AuthDTO(user, 'amdwiwnf');

export class AuthService {
  static signUp = async (body: SignUpBody): Promise<AuthDTO> => {
    const normalizedEmail = normalizeEmail(body.email);

    const user = await UsersService.findOneByCondition({ normalizedEmail });
    if (user) {
      throw new BadRequestError('The user with the specified email already exists.');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const { id, role } = await UsersService.create({ ...body, normalizedEmail, password: hashedPassword });

    const { accessToken, refreshToken } = JWTService.generateTokens({ userId: id, role });

    await UsersService.update(id, { refreshToken });

    return {
      id,
      accessToken,
      refreshToken,
    };
  };

  static logIn = async ({ email, password }: LogInBody): Promise<AuthDTO> => {
    const normalizedEmail = normalizeEmail(email);

    const user = await UsersService.findOneByCondition({ normalizedEmail });
    if (!user) {
      throw new NotFoundError('The user with the specified email does not exist.');
    }

    const isPasswordsEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordsEquals) {
      throw new UnauthorizedError('Invalid password');
    }

    const { id, role } = user;

    const { accessToken, refreshToken } = JWTService.generateTokens({ userId: id, role });

    await UsersService.update(id, { refreshToken });

    return {
      id,
      accessToken,
      refreshToken,
    };
  };

  static logOut = async (userId: number): Promise<void> => {
    await UsersService.update(userId, { refreshToken: null });
  };

  static refresh = async (req: Request): Promise<AuthDTO> => {
    logRequest(req);
    return authDTO;
  };
}
