import { UserDTO } from './user.dto';
import { User } from './user.entity';

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export const USER = new User(1, 'Angelina', 'email@gmail.com', 'email@gmail.com', 'qwerty123', 'user', 'awdwkmkwad243', new Date(), new Date());
export const USER_DTO = new UserDTO(USER);
