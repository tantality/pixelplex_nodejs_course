import { Response } from 'express';
import { AuthDTO } from '../auth.dto';

export type SignUpResponse = Response<AuthDTO>;
export type LogInResponse = Response<AuthDTO>;
export type LogOutResponse = Response<{ id: number }>;
export type RefreshTokensResponse = Response<AuthDTO>;
