import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import commentRouter from '../comment.router';
import { Comment } from '../comment.model';
import { Post } from '../../posts/post.model';
import {
    mockPost,
    mockComment,
    mockInvalidCommentId
} from '../../mocks';

describe('GET /api/comments/:id - Get a comment by ID', () => {
    let app: Express;
    const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/assignment1web_test';

    beforeAll(async () => {
        await mongoose.connect(testDbUri);
        app = express();
        app.use(express.json());
        app.use('/api/comments', commentRouter);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Comment.deleteMany({});
        await Post.deleteMany({});
    });

    it('should return a comment by ID', async () => {
        const post = await Post.create(mockPost);

        const comment = await Comment.create({
            ...mockComment,
            postId: post._id,
            content: 'Test comment content'
        });

        const response = await request(app)
            .get(`/api/comments/${comment._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id', comment._id.toString());
        expect(response.body.data).toHaveProperty('owner', 'Comment Owner');
        expect(response.body.data).toHaveProperty('content', 'Test comment content');
    });

    it('should return 404 when comment does not exist', async () => {
        await request(app)
            .get(`/api/comments/${mockInvalidCommentId}`)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should return 404 for invalid ID format', async () => {
        await request(app)
            .get('/api/comments/invalid-id')
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});
