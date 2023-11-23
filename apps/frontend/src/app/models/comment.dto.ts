import { Model } from '../utils/types';
import { Dto } from './dto.base';

/**
 * Dto for comments.
 *
 * @property {string} comment - The comment
 */
export class CommentDto extends Dto {
  public comment!: string;
}

export type Comment = Model<CommentDto>;