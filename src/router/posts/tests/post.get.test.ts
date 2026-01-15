import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import postRouter from '../post.router';
import { Post } from '../post.model';
import {
    mockPostMultiple,
    mockPostOlder,
    mockPostNewer,
    mockPost
} from '../../mocks';

describe('GET /api/posts - Get all posts', () => {
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

  it('should return empty array when no posts exist', async () => {
    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('should return all posts as JSON array', async () => {
    await Post.insertMany(mockPostMultiple);

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  it('should return posts sorted by publishDate descending (newest first)', async () => {
    await Post.insertMany([mockPostOlder, mockPostNewer]);

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].title).toBe('Newer Post');
    expect(response.body.data[1].title).toBe('Older Post');
  });

  it('should return posts with all required fields', async () => {
    await Post.insertMany([mockPost]);

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    const post = response.body.data[0];
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('content');
    expect(post).toHaveProperty('author');
    expect(post).toHaveProperty('publishDate');
    expect(post).toHaveProperty('_id');
  });
});

