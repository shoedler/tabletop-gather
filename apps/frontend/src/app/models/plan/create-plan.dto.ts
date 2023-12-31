import { Model } from '../../utils/types';
import { Dto } from '../base.dto';
import { GameDto } from '../game/game.dto';
import { CreateGathering } from '../gathering/create-gathering.dto';

/**
 * Dto for creating plans.
 *
 * @property {string} name - The name of the plan
 * @property {string} description - The description of the plan
 * @property {boolean} isPrivate - Whether the plan is private or not
 * @property {number} playerLimit - The player limit of the plan
 * @property {GameDto[id]} gameId - The game of the plan
 * @property {CreateGathering[]} gatherings - The gatherings of the plan
 */
export class CreatePlanDto extends Dto {
  public name!: string;
  public isPrivate!: boolean;
  public description!: string;
  public playerLimit!: number;
  public gameId?: GameDto['id'];
  public gatherings: CreateGathering[] = [];
}

/**
 * Model for creating plans.
 *
 * @see {@link CreatePlanDto}
 */
export type CreatePlan = Model<CreatePlanDto>;
