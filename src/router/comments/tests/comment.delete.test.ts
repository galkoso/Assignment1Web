import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import commentRouter from '../comment.router';
import { Comment } from '../comment.model';
import { Post } from '../../posts/post.model';
import {
    mockPost,
    mockCommentToDelete,
    mockComment1,
    mockComment2,
    mockInvalidCommentId
} from '../../mocks';

describe('DELETE /api/comments/:id - Delete a comment', () => {
    let app: Express;
    const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/assignment1web_test';

    beforeAll(async () => {
        await mongoose.connect(testDbUri);
        app = express();
        app.use(express.json());
        app.use('/api/comments', commentRouter);
    });

    afterAll(async () => await mongoose.connection.close());

    beforeEach(async () => await Comment.deleteMany({}) && await Post.deleteMany({}));

    it('should delete a comment successfully', async () => {
        const post = await Post.create(mockPost);

        const comment = await Comment.create({
            ...mockCommentToDelete,
            postId: post._id
        });

        const response = await request(app)
            .delete(`/api/comments/${comment._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('message', 'Comment deleted successfully');

        const deletedComment = await Comment.findById(comment._id);
        expect(deletedComment).toBeNull();
    });

    it('should return 404 when comment does not exist', async () => {
        await request(app)
            .delete(`/api/comments/${mockInvalidCommentId}`)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should only delete the specified comment', async () => {
        const post = await Post.create(mockPost);

        const comment1 = await Comment.create({
            ...mockComment1,
            postId: post._id
        });

        const comment2 = await Comment.create({
            ...mockComment2,
            postId: post._id
        });

        await request(app)
            .delete(`/api/comments/${comment1._id}`)
            .expect(StatusCodes.OK);

        const deletedComment = await Comment.findById(comment1._id);
        expect(deletedComment).toBeNull();

        const remainingComment = await Comment.findById(comment2._id);
        expect(remainingComment).not.toBeNull();
        expect(remainingComment?.content).toBe('Comment 2');
    });
});
