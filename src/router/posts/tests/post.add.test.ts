import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import postRouter from '../post.router.js';
import { Post } from '../post.model.js';

describe('POST /api/posts - Add a new post', () => {
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

  it('should create a new post successfully', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is a test post content',
      author: 'Test Author',
      publishDate: new Date('2024-01-15')
    };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Post created successfully');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('title', postData.title);
    expect(response.body.data).toHaveProperty('content', postData.content);
    expect(response.body.data).toHaveProperty('author', postData.author);
    expect(response.body.data).toHaveProperty('publishDate');
    expect(response.body.data).toHaveProperty('_id');
  });

  it('should fail when title is missing', async () => {
    const postData = {
      content: 'This is a test post content',
      author: 'Test Author',
      publishDate: new Date('2024-01-15')
    };

    await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(500);
  });

  it('should fail when content is missing', async () => {
    const postData = {
      title: 'Test Post',
      author: 'Test Author',
      publishDate: new Date('2024-01-15')
    };

    await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(500);
  });

  it('should fail when author is missing', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is a test post content',
      publishDate: new Date('2024-01-15')
    };

    await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(500);
  });

  it('should use default publishDate when not provided', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is a test post content',
      author: 'Test Author'
    };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(201);

    expect(response.body.data).toHaveProperty('publishDate');
    expect(new Date(response.body.data.publishDate)).toBeInstanceOf(Date);
  });
});

