import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import postRouter from '../post.router';
import { Post } from '../post.model';
import {
    mockPostByJohn,
    mockPostByJane,
    mockPostAnotherByJohn,
    mockPostOlderByJohn,
    mockPostNewerByJohn,
    mockPostWithSpaces,
    mockPostMultiple
} from '../../mocks';

describe('GET /api/posts?sender=<sender_id> - Get posts by sender', () => {
  let app: Express;
  const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/assignment1web_test';

  beforeAll(async () => {
    await mongoose.connect(testDbUri);
    app = express();
    app.use(express.json());
    app.use('/api/posts', postRouter);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Post.deleteMany({});
  });

  it('should return only posts from the specified sender', async () => {
    await Post.insertMany([
      mockPostByJohn,
      mockPostByJane,
      mockPostAnotherByJohn
    ]);

    const response = await request(app)
      .get('/api/posts?sender=John Doe')
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
    response.body.data.forEach((post: any) => {
      expect(post.author).toBe('John Doe');
    });
  });

  it('should return empty array when sender has no posts', async () => {
    await Post.insertMany([mockPostByJohn]);

    const response = await request(app)
      .get('/api/posts?sender=NonExistent Author')
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('should return posts sorted by publishDate descending', async () => {
    await Post.insertMany([
      mockPostOlderByJohn,
      mockPostNewerByJohn
    ]);

    const response = await request(app)
      .get('/api/posts?sender=John Doe')
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].title).toBe('Newer Post by John');
    expect(response.body.data[1].title).toBe('Older Post by John');
  });

  it('should return all posts when sender query parameter is not provided', async () => {
    await Post.insertMany(mockPostMultiple);

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBe(2);
  });

  it('should handle sender query parameter with special characters', async () => {
    await Post.insertMany([mockPostWithSpaces]);

    const response = await request(app)
      .get('/api/posts?sender=Author with Spaces')
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].author).toBe('Author with Spaces');
  });
});
