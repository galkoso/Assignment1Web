import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Post } from './post.model';
import { IPost } from './post.schema';

export const addPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, author, publishDate } = req.body;
        const newPost: IPost = { title, content, author, publishDate };
        const post = await Post.create(newPost);

        res.status(StatusCodes.CREATED).json({ message: 'Post created successfully', data: post });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create post' });
    };
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sender } = req.query;
        const filter = sender ? { author: sender } : {};
        const posts = await Post.find(filter).sort({ publishDate: -1 });

        res.status(StatusCodes.OK).json({ data: posts });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch posts' });
    };
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Post not found' });
            return;
        };

        res.status(StatusCodes.OK).json({ post });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch post' });
    };
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const { title, content, author, publishDate } = req.body;
        
        if (!title || !content || !author || !publishDate) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update post' });
            return;
        }
        
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, author, publishDate },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            res.status(StatusCodes.NOT_FOUND).json({ error: 'Post not found' });
            return;
        };

        res.status(StatusCodes.OK).json({ message: 'Post updated successfully', updatedPost });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update post' });
    };
};
