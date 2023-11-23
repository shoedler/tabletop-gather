import { Model } from '../utils/types';
import { Dto } from './dto.base';
import { User } from './user.dto';

/**
 * Dto for logging in a user.
 *
 * @property {User['email']} email - The email address of the user
 * @property {string} password - The password of the user
 */
export class LoginUserDto extends Dto {
  public email!: User['email'];
  public password!: string;
}

export type LoginUser = Model<LoginUserDto>;
