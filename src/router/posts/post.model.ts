import { model, Model } from 'mongoose';
import { postSchema, IPost } from './post.schema';

export const Post: Model<IPost> = model<IPost>('Post', postSchema);
