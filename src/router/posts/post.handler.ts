import { Request, Response } from 'express';
import { Post, IPost } from './post.model.js';

export const addPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, author, publishDate } = req.body;
        const newPost: IPost = { title, content, author, publishDate };
        const post = await Post.create(newPost);

        res.status(201).json({ message: 'Post created successfully', data: post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
};

export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find().sort({ publishDate: -1 });

        res.status(200).json({ data: posts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

