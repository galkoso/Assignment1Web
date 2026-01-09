import { Schema } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  author: string;
  publishDate: Date;
}

export const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    publishDate: {
      type: Date,
      required: true,
      default: Date.now
    }
  }
);

