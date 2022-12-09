import normalizeEmail from 'normalize-email';
import * as bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { UsersService } from '../users/users.service';
import { IAuth, LogInBody, SignUpBody } from './types';
import { JWTService } from './jwt.service';
import { SALT_ROUNDS } from './auth.constants';

export class AuthService {
  static signUp = async (body: SignUpBody): Promise<IAuth> => {
    const normalizedEmail = normalizeEmail(body.email);

    const user = await UsersService.findOneByCondition({ normalizedEmail });
    if (user) {
      throw new BadRequestError('The user with the specified email already exists.');
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

  static refresh = async (refreshTokenReceived?: string): Promise<IAuth> => {
    if (!refreshTokenReceived) {
      throw new UnauthorizedError('Refresh token is missing');
    }

    const user = await UsersService.findOneByCondition({ refreshToken: refreshTokenReceived });
    if (!user) {
      throw new NotFoundError('Refresh token not found.');
    }

    const verifiedRefreshToken = JWTService.validateRefreshToken(refreshTokenReceived);
    if (!verifiedRefreshToken) {
      throw new UnauthorizedError('Refresh token is invalid.');
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
