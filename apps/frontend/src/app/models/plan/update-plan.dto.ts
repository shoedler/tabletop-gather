import { Model, Uuid } from '../../utils/types';
import { Dto } from '../base.dto';

/**
 * Dto for creating a plan
 *
 * @param {string} name - The name of the plan
 * @param {boolean} isPrivate - Whether the plan is private
 * @param {string} description - The description of the plan
 * @param {number} playerLimit - The player limit of the plan
 * @param {Uuid} game - The game of the plan
 */
export class UpdatePlanDto extends Dto {
  public name!: string;
  public isPrivate!: boolean;
  public description!: string;
  public playerLimit!: number;
  public game?: Uuid;
}

/**
 * Model for creating a plan
 *
 * @see {@link UpdatePlanDto}
 */
export type UpdatePlan = Model<UpdatePlanDto>;
