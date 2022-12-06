import { UserDTO } from './user.dto';
import { User } from './user.entity';

export const USER = new User();
USER.id = 1;
USER.name = 'Angelina';
USER.email = 'email@gmail.com';
USER.normalizedEmail = 'email@gmail.com';
USER.password = 'qwerty123';
USER.role = 'user';
USER.refreshToken = 'awdwkmkwad243';
USER.createdAt = new Date();
USER.updatedAt = new Date();

export const USER_DTO = new UserDTO(USER);
