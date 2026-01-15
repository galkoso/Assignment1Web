import { Schema, Types } from 'mongoose';

export interface IComment {
    owner: string;
    postId: Types.ObjectId | string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const commentSchema = new Schema<IComment>(
    {
        owner: {
            type: String,
            required: true,
            trim: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);
