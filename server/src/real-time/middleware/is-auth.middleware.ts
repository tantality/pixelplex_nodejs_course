import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { UnauthorizedError, ACCESS_TOKEN_IS_MISSING_OR_INVALID_MESSAGE } from '../../errors';
import { TokensService } from '../../modules/auth/tokens.service';

export const isAuth = (socket: Socket, next: (err?: ExtendedError) => void): void => {
  try {
    const accessToken = socket.handshake.auth.accessToken;
    if (!accessToken || typeof accessToken !== 'string') {
      throw new Error();
    }

    TokensService.validateAccessToken(accessToken);

    next();
  } catch (err) {
    next(new UnauthorizedError(ACCESS_TOKEN_IS_MISSING_OR_INVALID_MESSAGE));
  }
};
