import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import commentRouter from '../comment.router.js';
import { Comment } from '../comment.model.js';
import { Post } from '../../posts/post.model.js';
import {
    mockPost,
    mockComment,
    mockInvalidCommentId
} from '../../mocks.js';

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
            .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id', comment._id.toString());
        expect(response.body.data).toHaveProperty('owner', 'Comment Owner');
        expect(response.body.data).toHaveProperty('content', 'Test comment content');
    });

    it('should return 404 when comment does not exist', async () => {
        await request(app)
            .get(`/api/comments/${mockInvalidCommentId}`)
            .expect(404);
    });

    it('should return 404 for invalid ID format', async () => {
        await request(app)
            .get('/api/comments/invalid-id')
            .expect(500);
    });
});
