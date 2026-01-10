import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import postRouter from '../post.router.js';
import { Post } from '../post.model.js';

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
      {
        title: 'Post by John',
        content: 'Content by John',
        author: 'John Doe',
        publishDate: new Date('2024-01-15')
      },
      {
        title: 'Post by Jane',
        content: 'Content by Jane',
        author: 'Jane Doe',
        publishDate: new Date('2024-01-16')
      },
      {
        title: 'Another Post by John',
        content: 'Another content by John',
        author: 'John Doe',
        publishDate: new Date('2024-01-17')
      }
    ]);

    const response = await request(app)
      .get('/api/posts?sender=John Doe')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
    response.body.data.forEach((post: any) => {
      expect(post.author).toBe('John Doe');
    });
  });

  it('should return empty array when sender has no posts', async () => {
    await Post.insertMany([
      {
        title: 'Post by John',
        content: 'Content by John',
        author: 'John Doe',
        publishDate: new Date('2024-01-15')
      }
    ]);

    const response = await request(app)
      .get('/api/posts?sender=NonExistent Author')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('should return posts sorted by publishDate descending', async () => {
    await Post.insertMany([
      {
        title: 'Older Post by John',
        content: 'Older content',
        author: 'John Doe',
        publishDate: new Date('2024-01-10')
      },
      {
        title: 'Newer Post by John',
        content: 'Newer content',
        author: 'John Doe',
        publishDate: new Date('2024-01-20')
      }
    ]);

    const response = await request(app)
      .get('/api/posts?sender=John Doe')
      .expect(200);

    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].title).toBe('Newer Post by John');
    expect(response.body.data[1].title).toBe('Older Post by John');
  });

  it('should return all posts when sender query parameter is not provided', async () => {
    await Post.insertMany([
      {
        title: 'Post by John',
        content: 'Content by John',
        author: 'John Doe',
        publishDate: new Date('2024-01-15')
      },
      {
        title: 'Post by Jane',
        content: 'Content by Jane',
        author: 'Jane Doe',
        publishDate: new Date('2024-01-16')
      }
    ]);

    const response = await request(app)
      .get('/api/posts')
      .expect(200);

    expect(response.body.data.length).toBe(2);
  });

  it('should handle sender query parameter with special characters', async () => {
    await Post.insertMany([
      {
        title: 'Post by Author with Spaces',
        content: 'Content',
        author: 'Author with Spaces',
        publishDate: new Date('2024-01-15')
      }
    ]);

    const response = await request(app)
      .get('/api/posts?sender=Author with Spaces')
      .expect(200);

    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].author).toBe('Author with Spaces');
  });
});
