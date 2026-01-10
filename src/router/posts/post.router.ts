import { Router } from 'express';
import { addPost, getAllPosts } from './post.handler.js';

const router = Router();

router.post('/', addPost);
router.get('/', getAllPosts);

export default router;

