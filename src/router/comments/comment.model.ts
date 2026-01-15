import { model, Model } from 'mongoose';
import { commentSchema, IComment } from './comment.schema.js';

export const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);
