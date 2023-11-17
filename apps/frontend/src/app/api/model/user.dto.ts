import { Dto } from './dto.base';

export class UserDto extends Dto {
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
}
