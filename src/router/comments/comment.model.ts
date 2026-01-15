import { model, Model } from 'mongoose';
import { commentSchema, IComment } from './comment.schema';

export const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);

export type { IComment };