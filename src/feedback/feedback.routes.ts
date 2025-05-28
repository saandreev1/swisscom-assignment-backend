import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    submitFeedbackHandler,
    getFeedbackHandler,
    deleteFeedbackHandler
} from './feedback.controller';

const router = Router();

/**
 * @openapi
 * /api/feedback/{token}:
 *   post:
 *     summary: Submit feedback using token
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Feedback token provided to the candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Answers must be an array
 */
router.post('/feedback/:token', submitFeedbackHandler);

/**
 * @openapi
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Feedback data
 *       404:
 *         description: Feedback not found
 */
router.get('/feedback/:id', authenticate, getFeedbackHandler);

/**
 * @openapi
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Feedback deleted
 *       400:
 *         description: Forbidden or deletion error
 *       403:
 *         description: Forbidden
 */
router.delete('/feedback/:id', authenticate, deleteFeedbackHandler);

export default router;