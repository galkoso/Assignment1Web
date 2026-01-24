import { Router } from 'express';
import { addPost, getAllPosts, getPostById, updatePost } from './post.handler';

const router = Router();

router.post('/', addPost);
// this route is used to get all posts and to get posts by sender
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.put('/:postId', updatePost);

export default router;
