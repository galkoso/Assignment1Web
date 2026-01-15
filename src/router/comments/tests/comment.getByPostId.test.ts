import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import commentRouter from '../comment.router';
import { Comment } from '../comment.model';
import { Post } from '../../posts/post.model';
import {
    mockPost,
    mockPostMultiple,
    mockCommentMultiple,
    mockCommentOlder,
    mockCommentNewer,
    mockCommentForPost1,
    mockCommentForPost2,
    mockInvalidPostId
} from '../../mocks';

describe('GET /api/comments/post/:postId - Get all comments for a post', () => {
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

    it('should return empty array when no comments exist for post', async () => {
        const post = await Post.create(mockPost);

        const response = await request(app)
            .get(`/api/comments/post/${post._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('count', 0);
        expect(response.body.data).toEqual([]);
    });

    it('should return all comments for a specific post', async () => {
        const post = await Post.create(mockPost);

        await Comment.insertMany(
            mockCommentMultiple.map(comment => ({
                ...comment,
                postId: post._id
            }))
        );

        const response = await request(app)
            .get(`/api/comments/post/${post._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('count', 2);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);
    });

    it('should return comments sorted by createdAt descending (newest first)', async () => {
        const post = await Post.create(mockPost);

        await Comment.create({
            ...mockCommentOlder,
            postId: post._id
        });

        await Comment.create({
            ...mockCommentNewer,
            postId: post._id
        });

        const response = await request(app)
            .get(`/api/comments/post/${post._id}`)
            .expect(StatusCodes.OK);

        expect(response.body.data.length).toBe(2);
        expect(response.body.data[0].content).toBe('Newer comment');
        expect(response.body.data[1].content).toBe('Older comment');
    });

    it('should return 404 when post does not exist', async () => {
        await request(app)
            .get(`/api/comments/post/${mockInvalidPostId}`)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should only return comments for the specified post', async () => {
        const post1 = await Post.create(mockPostMultiple[0]);
        const post2 = await Post.create(mockPostMultiple[1]);

        await Comment.create({
            ...mockCommentForPost1,
            postId: post1._id
        });

        await Comment.create({
            ...mockCommentForPost2,
            postId: post2._id
        });

        const response = await request(app)
            .get(`/api/comments/post/${post1._id}`)
            .expect(StatusCodes.OK);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].content).toBe('Comment for post 1');
    });
});
