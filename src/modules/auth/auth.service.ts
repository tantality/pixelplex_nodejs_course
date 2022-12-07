/* eslint-disable import/no-named-as-default-member */
/* eslint-disable require-await */
import { Request } from 'express';
import normalizeEmail from 'normalize-email';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from '../../errors';
import { logRequest } from '../../utils';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthDTO } from './auth.dto';
import { LogInRequest, SignUpBody } from './types';
import { TokenService } from './token.service';

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

    const userWithCurrentNormalizedEmail = await UsersService.findOneByCondition({ normalizedEmail });
    if (userWithCurrentNormalizedEmail) {
      throw new BadRequestError('The user with the specified email already exists.');
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const { id, role } = await UsersService.create({ ...body, normalizedEmail, password: hashedPassword, refreshToken: null });

    const tokens = TokenService.generateTokens({ userId: id, role });

    await UsersService.update(id, { refreshToken: tokens.refreshToken });

    return {
      id,
      ...tokens,
    };
  };

  static logIn = async (req: LogInRequest): Promise<AuthDTO> => {
    logRequest(req);
    return authDTO;
  };

  static logOut = async (req: Request): Promise<number> => {
    logRequest(req);
    return 1;
  };

  static refresh = async (req: Request): Promise<AuthDTO> => {
    logRequest(req);
    return authDTO;
  };
}
