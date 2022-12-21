import normalizeEmail from 'normalize-email';
import * as bcrypt from 'bcrypt';
import { USER_ROLE } from '../users/types';

export const MIN_NAME_LENGTH = 5;
export const MAX_NAME_LENGTH = 256;

export const MIN_PASSWORD_LENGTH = 8;

export const ACCESS_TOKEN_LIFETIME_IN_MS = 30 * 60 * 1000; // 30 minutes
export const REFRESH_TOKEN_LIFETIME_IN_MS = 2 * 30 * 24 * 60 * 60 * 1000; // 60 days

export const SALT_ROUNDS = 10;

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Admin123!';

export const ADMIN = {
  NAME: 'admin',
  EMAIL: ADMIN_EMAIL,
  NORMALIZED_EMAIL: normalizeEmail(ADMIN_EMAIL),
  PASSWORD: await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS),
  ROLE: USER_ROLE.ADMIN,
};
