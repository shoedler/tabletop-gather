import { Model } from '../../utils/types';
import { Dto } from '../base.dto';

/**
 * Dto for updating comments.
 *
 * @property {string} comment - The comment
 * @extends {Dto}
 */
export class UpdateCommentDto extends Dto {
  public comment!: string;
}

export type UpdateComment = Model<UpdateCommentDto>;
