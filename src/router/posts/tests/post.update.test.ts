import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import postRouter from '../post.router.js';
import { Post } from '../post.model.js';

describe('PUT /api/posts/:postId - Update a post', () => {
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

  it('should update a post successfully with all fields', async () => {
    const createdPost = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      author: 'Original Author',
      publishDate: new Date('2024-01-15')
    });

    const updateData = {
      title: 'Updated Title',
      content: 'Updated content',
      author: 'Updated Author',
      publishDate: new Date('2024-01-20')
    };

    const response = await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Post updated successfully');
    expect(response.body).toHaveProperty('updatedPost');
    expect(response.body.updatedPost).toHaveProperty('title', updateData.title);
    expect(response.body.updatedPost).toHaveProperty('content', updateData.content);
    expect(response.body.updatedPost).toHaveProperty('author', updateData.author);
    expect(response.body.updatedPost._id.toString()).toBe(createdPost._id.toString());
  });

  it('should return 404 when post ID does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const updateData = {
      title: 'Updated Title',
      content: 'Updated content',
      author: 'Updated Author',
      publishDate: new Date('2024-01-20')
    };

    const response = await request(app)
      .put(`/api/posts/${fakeId.toString()}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Post not found');
  });

  it('should update only provided fields', async () => {
    const createdPost = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      author: 'Original Author',
      publishDate: new Date('2024-01-15')
    });

    const updateData = {
      title: 'Updated Title',
      content: 'Updated content',
      author: 'Original Author',
      publishDate: new Date('2024-01-15')
    };

    const response = await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(200);

    expect(response.body.updatedPost.title).toBe('Updated Title');
    expect(response.body.updatedPost.content).toBe('Updated content');
    expect(response.body.updatedPost.author).toBe('Original Author');
  });

  it('should return 500 when invalid ID format is provided', async () => {
    const updateData = {
      title: 'Updated Title',
      content: 'Updated content',
      author: 'Updated Author',
      publishDate: new Date('2024-01-20')
    };

    const response = await request(app)
      .put('/api/posts/invalid-id')
      .send(updateData)
      .expect(500);

    expect(response.body).toHaveProperty('error', 'Failed to update post');
  });

  it('should fail when required fields are missing', async () => {
    const createdPost = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      author: 'Original Author',
      publishDate: new Date('2024-01-15')
    });

    const updateData = {
      title: 'Updated Title'
    };

    await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(500);
  });

  it('should maintain post ID after update', async () => {
    const createdPost = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      author: 'Original Author',
      publishDate: new Date('2024-01-15')
    });

    const originalId = createdPost._id.toString();

    const updateData = {
      title: 'Updated Title',
      content: 'Updated content',
      author: 'Updated Author',
      publishDate: new Date('2024-01-20')
    };

    const response = await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(200);

    expect(response.body.updatedPost._id.toString()).toBe(originalId);
  });
});
