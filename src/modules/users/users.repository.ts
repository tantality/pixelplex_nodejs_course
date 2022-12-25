import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { CreateUserData, UpdateUserBody } from './types';
import { User } from './user.entity';

export class UsersRepository {
  static findOneByCondition = async (whereCondition: FindOptionsWhere<User>): Promise<User | null> => {
    const user = await User.findOneBy(whereCondition);
    return user;
  };

  static create = async (userData: CreateUserData): Promise<User> => {
    const createdUser = User.create(userData as DeepPartial<User>);
    const savedUser = await User.save(createdUser);

    return savedUser;
  };

  static update = async (currentUser: User, id: number, body: UpdateUserBody): Promise<User> => {
    await User.update({ id }, { ...currentUser, ...body });

    const updatedUser = (await UsersRepository.findOneByCondition({ id })) as User;

    return updatedUser;
  };
}
