import { Request, Response } from 'express';
import { Comment, IComment } from './comment.model.js';
import { Post } from '../posts/post.model.js';

export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { owner, postId, content } = req.body;

        if (!owner || !postId || !content) {
            res.status(400).json({ error: 'Owner, postId, and content are required' });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const newComment: IComment = {
            owner: owner.trim(),
            postId: postId,
            content: content.trim()
        };

        const comment = await Comment.create(newComment);

        res.status(201).json({ message: 'Comment created successfully', data: comment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
};

export const getCommentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        comment ? res.status(200).json({ data: comment }) : res.status(404).json({ error: 'Comment not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comment' });
    }
};

export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

        comments ? res.status(200).json({ count: comments.length, data: comments }) : res.status(404).json({ error: 'Comments not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ error: 'Content is required' });
            return;
        }

        const comment = await Comment.findByIdAndUpdate(
            id,
            { content: content.trim() },
            { new: true, runValidators: true }
        );

        comment
            ? res.status(200).json({ message: 'Comment updated successfully', data: comment })
            : res.status(404).json({ error: 'Comment not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);

        comment ? res.status(200).json({ message: 'Comment deleted successfully' }) : res.status(404).json({ error: 'Comment not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};
