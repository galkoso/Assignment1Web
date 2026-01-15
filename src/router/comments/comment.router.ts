import { Router } from 'express';
import {
    createComment,
    getCommentById,
    getCommentsByPostId,
    updateComment,
    deleteComment
} from './comment.handler';

const router = Router();

router.post('/', createComment);
router.get('/post/:postId', getCommentsByPostId);
router.get('/:id', getCommentById);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
