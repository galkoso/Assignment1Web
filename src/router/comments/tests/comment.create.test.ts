import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import commentRouter from '../comment.router';
import { Comment } from '../comment.model';
import { Post } from '../../posts/post.model';
import {
    mockPost,
    mockCommentData,
    mockCommentWithoutOwner,
    mockCommentWithoutPostId,
    mockCommentWithoutContent,
    mockInvalidPostId
} from '../../mocks';

describe('POST /api/comments - Create a new comment', () => {
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

    it('should create a new comment successfully', async () => {
        const post = await Post.create(mockPost);

        const commentData = {
            ...mockCommentData,
            postId: post._id.toString()
        };

        const response = await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.CREATED);

        expect(response.body).toHaveProperty('message', 'Comment created successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('owner', commentData.owner);
        expect(response.body.data).toHaveProperty('content', commentData.content);
        expect(response.body.data).toHaveProperty('postId');
        expect(response.body.data).toHaveProperty('_id');
    });

    it('should fail when owner is missing', async () => {
        const post = await Post.create(mockPost);

        const commentData = {
            ...mockCommentWithoutOwner,
            postId: post._id.toString()
        };

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when postId is missing', async () => {
        const commentData = mockCommentWithoutPostId;

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when content is missing', async () => {
        const post = await Post.create(mockPost);

        const commentData = {
            ...mockCommentWithoutContent,
            postId: post._id.toString()
        };

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when post does not exist', async () => {
        const commentData = {
            ...mockCommentData,
            postId: mockInvalidPostId
        };

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.NOT_FOUND);
    });
});
