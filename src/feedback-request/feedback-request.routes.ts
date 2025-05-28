import { Router } from 'express';
import {
    createFeedbackRequestHandler,
    getFeedbackRequestsHandler,
    deleteFeedbackRequestHandler,
    getFeedbackRequestByTokenHandler
} from './feedback-request.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/feedback-requests:
 *   post:
 *     summary: Create a new feedback request
 *     tags: [FeedbackRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidateEmail
 *               - formId
 *             properties:
 *               candidateEmail:
 *                 type: string
 *               formId:
 *                 type: integer
 *               candidateName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback request created
 */
router.post('/feedback-requests', authenticate, createFeedbackRequestHandler);

/**
 * @openapi
 * /api/feedback-requests:
 *   get:
 *     summary: Get all feedback requests
 *     tags: [FeedbackRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reviewerId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by reviewer ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUBMITTED]
 *         required: false
 *         description: Filter by status
 *       - in: query
 *         name: formId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by form ID
 *       - in: query
 *         name: candidateEmail
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by candidate email
 *       - in: query
 *         name: candidateName
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by candidate name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Pagination - page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Pagination - page size
 *     responses:
 *       200:
 *         description: A list of feedback requests
 */
router.get('/feedback-requests', authenticate, getFeedbackRequestsHandler);
/**
 * @openapi
 * /api/feedback-requests/token/{token}:
 *   get:
 *     summary: Get a feedback request by token (public access)
 *     tags: [FeedbackRequests]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Feedback request details
 */
router.get('/feedback-requests/token/:token', getFeedbackRequestByTokenHandler);

/**
 * @openapi
 * /api/feedback-requests/{id}:
 *   delete:
 *     summary: Delete a feedback request
 *     tags: [FeedbackRequests]
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
 *         description: Feedback request deleted
 */
router.delete('/feedback-requests/:id', authenticate, deleteFeedbackRequestHandler);

export default router;