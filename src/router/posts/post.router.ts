import { Router } from 'express';
import { addPost, getAllPosts, getPostById, updatePost } from './post.handler';

const router = Router();

router.post('/', addPost);
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.put('/:postId', updatePost);

export default router;
