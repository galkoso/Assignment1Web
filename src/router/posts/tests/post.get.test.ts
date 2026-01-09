import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import postRouter from '../post.router.js';
import { Post } from '../post.model.js';

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
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('should return all posts as JSON array', async () => {
    await Post.create({
      title: 'First Post',
      content: 'Content of first post',
      author: 'Author 1',
      publishDate: new Date('2024-01-15')
    });

    await Post.create({
      title: 'Second Post',
      content: 'Content of second post',
      author: 'Author 2',
      publishDate: new Date('2024-01-16')
    });

    const response = await request(app)
      .get('/api/posts')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  it('should return posts sorted by publishDate descending (newest first)', async () => {
    await Post.create({
      title: 'Older Post',
      content: 'Older content',
      author: 'Author 1',
      publishDate: new Date('2024-01-10')
    });

    await Post.create({
      title: 'Newer Post',
      content: 'Newer content',
      author: 'Author 2',
      publishDate: new Date('2024-01-20')
    });

    const response = await request(app)
      .get('/api/posts')
      .expect(200);

    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].title).toBe('Newer Post');
    expect(response.body.data[1].title).toBe('Older Post');
  });

  it('should return posts with all required fields', async () => {
    await Post.create({
      title: 'Test Post',
      content: 'Test content',
      author: 'Test Author',
      publishDate: new Date('2024-01-15')
    });

    const response = await request(app)
      .get('/api/posts')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    const post = response.body.data[0];
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('content');
    expect(post).toHaveProperty('author');
    expect(post).toHaveProperty('publishDate');
    expect(post).toHaveProperty('_id');
  });
});

