import { Model } from '../../utils/types';
import { Dto } from '../base.dto';

/**
 * Dto for guests.
 *
 * @property {string} name - The name of the guest
 * @property {string} email - The email address of the guest
 */
export class GuestDto extends Dto {
  public name!: string;
  public email!: string;
}

/**
 * Model for guests.
 *
 * @see {@link GuestDto}
 */
export type Guest = Model<GuestDto>;
