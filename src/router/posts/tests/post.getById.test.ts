import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import postRouter from '../post.router.js';
import { Post } from '../post.model.js';
import {
    mockPostData,
    mockPostComplete
} from '../../mocks.js';

describe('GET /api/posts/:postId - Get a post by ID', () => {
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

  it('should return a post when valid ID is provided', async () => {
    const createdPost = await Post.create(mockPostData);

    const response = await request(app)
      .get(`/api/posts/${createdPost._id.toString()}`)
      .expect(200);

    expect(response.body).toHaveProperty('post');
    expect(response.body.post).toHaveProperty('title', mockPostData.title);
    expect(response.body.post).toHaveProperty('content', mockPostData.content);
    expect(response.body.post).toHaveProperty('author', mockPostData.author);
    expect(response.body.post).toHaveProperty('_id', createdPost._id.toString());
  });

  it('should return 404 when post ID does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/posts/${fakeId.toString()}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Post not found');
  });

  it('should return 500 when invalid ID format is provided', async () => {
    const response = await request(app)
      .get('/api/posts/invalid-id')
      .expect(500);

    expect(response.body).toHaveProperty('error', 'Failed to fetch post');
  });

  it('should return post with all required fields', async () => {
    const createdPost = await Post.create(mockPostComplete);

    const response = await request(app)
      .get(`/api/posts/${createdPost._id.toString()}`)
      .expect(200);

    const post = response.body.post;
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('content');
    expect(post).toHaveProperty('author');
    expect(post).toHaveProperty('publishDate');
    expect(post).toHaveProperty('_id');
  });
});
