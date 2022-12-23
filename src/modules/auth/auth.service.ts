import normalizeEmail from 'normalize-email';
import * as bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import {
  INVALID_PASSWORD_MESSAGE,
  REFRESH_TOKEN_IS_INVALID_MESSAGE,
  REFRESH_TOKEN_IS_MISSING_MESSAGE,
  REFRESH_TOKEN_NOT_FOUND_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../../errors/error-messages.constants';
import { UsersService } from '../users/users.service';
import { IAuth, LogInBody, SignUpBody } from './types';
import { JWTService } from './jwt.service';
import { SALT_ROUNDS } from './auth.constants';

export class AuthService {
  static signUp = async (body: SignUpBody): Promise<IAuth> => {
    const normalizedEmail = normalizeEmail(body.email);
    const user = await UsersService.findOneByCondition({ normalizedEmail });
    if (user) {
      throw new BadRequestError(USER_ALREADY_EXISTS_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);
    const { id, role } = await UsersService.create({ ...body, normalizedEmail, password: hashedPassword });
    const { accessToken, refreshToken } = JWTService.generateTokens({ userId: id, role });

    await UsersService.update(id, { refreshToken });

    return {
      id,
      accessToken,
      refreshToken,
    };
  };

  static logIn = async ({ email, password }: LogInBody): Promise<IAuth> => {
    const normalizedEmail = normalizeEmail(email);
    const user = await UsersService.findOneByCondition({ normalizedEmail });
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError(INVALID_PASSWORD_MESSAGE);
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

  static refresh = async (refreshTokenReceived?: string): Promise<IAuth> => {
    if (!refreshTokenReceived) {
      throw new UnauthorizedError(REFRESH_TOKEN_IS_MISSING_MESSAGE);
    }

    const user = await UsersService.findOneByCondition({ refreshToken: refreshTokenReceived });
    if (!user) {
      throw new NotFoundError(REFRESH_TOKEN_NOT_FOUND_MESSAGE);
    }

    const verifiedRefreshToken = JWTService.validateRefreshToken(refreshTokenReceived);
    if (!verifiedRefreshToken) {
      throw new UnauthorizedError(REFRESH_TOKEN_IS_INVALID_MESSAGE);
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
}
