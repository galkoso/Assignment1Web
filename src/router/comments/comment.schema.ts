import { Schema } from 'mongoose';

export interface IComment {
    owner: string,
    postId: string,
    content: string
};

export const commentSchema = new Schema<IComment>({
    owner: {type: String, required: true},
    postId: { type: String, required: true },
    content: {type: String, required: true},
});
